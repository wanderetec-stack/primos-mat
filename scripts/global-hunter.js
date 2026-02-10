import axios from 'axios';
import * as cheerio from 'cheerio';
import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Client } = pkg;
const TARGET_DOMAIN = 'primos.mat.br';

// Database connection
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// User-Agent to mimic a real browser
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';

async function globalHunter() {
  console.log('🌍 Global Hunter Module (Phase 6) Initiated...');
  console.log('📡 Scanning Surface Web for backlinks and mentions...');
  
  const findings = [];
  
  // 1. Wikipedia API Search (High Authority)
  console.log('📚 Querying Wikipedia API...');
  try {
    const wikiResp = await axios.get('https://pt.wikipedia.org/w/api.php', {
        params: {
            action: 'query',
            list: 'search',
            srsearch: `primos.mat.br`, // Removed quotes for broader match
            format: 'json',
            utf8: 1
        },
        headers: {
            'User-Agent': 'PrimosMatBot/1.0 (https://primos.mat.br; wander@primos.mat.br)' // Required by MediaWiki
        }
    });

    if (wikiResp.data.query && wikiResp.data.query.search) {
        wikiResp.data.query.search.forEach(result => {
            // Strict Filter: Must contain the domain part
            if (!result.snippet.toLowerCase().includes('primos.mat')) return;

            findings.push({
                referrer: `https://pt.wikipedia.org/wiki/${encodeURIComponent(result.title.replace(/ /g, '_'))}`,
                title: result.title,
                context: result.snippet.replace(/<[^>]*>?/gm, ''), // Strip HTML
                source: 'Wikipedia (API)'
            });
        });
    }
  } catch (err) {
    console.error('❌ Error querying Wikipedia:', err.message);
  }

  // 2. DuckDuckGo Search (HTML Scraping)
  // Query: "primos.mat.br" -site:primos.mat.br
  console.log('🦆 Querying DuckDuckGo Index...');
  
  try {
    const response = await axios.get('https://html.duckduckgo.com/html/', {
      params: {
        q: `"${TARGET_DOMAIN}" -site:${TARGET_DOMAIN}`
      },
      headers: {
        'User-Agent': USER_AGENT
      }
    });

    const $ = cheerio.load(response.data);
    
    $('.result').each((i, el) => {
      const title = $(el).find('.result__title').text().trim();
      const link = $(el).find('.result__url').attr('href');
      const snippet = $(el).find('.result__snippet').text().trim();

      if (link && !link.includes(TARGET_DOMAIN)) {
        findings.push({
          referrer: link,
          title: title,
          context: snippet,
          source: 'DuckDuckGo Search'
        });
      }
    });

  } catch (err) {
    console.error('❌ Error querying DuckDuckGo:', err.message);
  }

  // 2. Common Crawl Index
  console.log('🕸️ Querying Common Crawl Index...');
  const CC_INDEX_SERVER = 'http://index.commoncrawl.org/CC-MAIN-2024-10-index'; // Recent index
  
  try {
    const ccResponse = await axios.get(`${CC_INDEX_SERVER}?url=*.${TARGET_DOMAIN}/*&output=json&limit=100`, {
        timeout: 30000
    });
    
    // Common Crawl returns newline-separated JSON objects
    const lines = ccResponse.data.trim().split('\n');
    lines.forEach(line => {
        try {
            const record = JSON.parse(line);
            // This tells us the site WAS seen, but not necessarily who linked to it.
            // However, it confirms presence in the crawl.
            // For backlinks, we'd need the "host-level" graph, which is harder.
            // But we can check if the record 'url' is different from our target? No, 'url' is the target.
            
            // Actually, Common Crawl index lists pages OF the site.
            // So this duplicates Hunter functionality (Phase 5), not Backlinks (Phase 6).
            // We need "who links TO us".
            // Wayback Machine has a "link" API? No.
        } catch (e) {}
    });
    console.log(`   ℹ️ Common Crawl checked (Index mode).`);
  } catch (err) {
    console.log('   ⚠️ Common Crawl Index unavailable or timed out.');
  }

  // 3. Google Search (Aggressive Fallback)
  // We will try a very simple query to a different endpoint if possible, or just log that we tried.
  
  console.log(`📦 Found ${findings.length} potential external references.`);

  if (findings.length === 0) {
    console.log('⚠️ No external references found in this pass. The web might be quiet about us.');
    return;
  }

  // 3. Save to Database
  await client.connect();
  let newCount = 0;

  for (const item of findings) {
    // We assume these link to the homepage '/' unless we can extract a specific path from the snippet
    // For now, we map them to '/' as "General Mentions"
    const targetPath = '/'; 
    
    try {
      // Check if this referrer is already known
      // We need to check scan_data->>'referrer_url' 
      const check = await client.query(`
        SELECT id FROM scanned_urls 
        WHERE scan_data->>'referrer_url' = $1
      `, [item.referrer]);

      if (check.rows.length === 0) {
        // Insert
        await client.query(`
          INSERT INTO scanned_urls (url, title, source, status, scan_data, created_at)
          VALUES ($1, $2, $3, 'referência_externa', $4, NOW())
        `, [
          targetPath,
          item.title,
          item.source,
          JSON.stringify({
            referrer_url: item.referrer,
            context: item.context,
            authority: 'Detected via Global Scanner'
          })
        ]);
        console.log(`✨ New Backlink Found: ${item.referrer}`);
        newCount++;
      } else {
        console.log(`zzz Known Backlink: ${item.referrer}`);
      }
    } catch (err) {
      console.error(`Error saving ${item.referrer}:`, err.message);
    }
  }

  console.log(`\n✅ Global Scan Complete. Added ${newCount} new external references.`);
  await client.end();
}

globalHunter();
