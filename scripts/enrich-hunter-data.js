import pkg from 'pg';
import dotenv from 'dotenv';
import axios from 'axios';
import * as cheerio from 'cheerio';

dotenv.config();

const { Client } = pkg;

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function enrichData() {
  console.log('💎 Starting Enrichment Process...');
  await client.connect();

  try {
    // Select targets that need enrichment
    // We target Hunter Module entries that still have the default title or generic title
    const res = await client.query(`
      SELECT id, url, title, scan_data 
      FROM scanned_urls 
      WHERE source = 'Hunter Module' 
    `);

    console.log(`🔍 Found ${res.rows.length} candidates for enrichment.`);

    let successCount = 0;
    let errorCount = 0;

    for (const row of res.rows) {
      const scanData = typeof row.scan_data === 'string' ? JSON.parse(row.scan_data) : row.scan_data;
      
      if (!scanData || !scanData.snapshot) {
        console.log(`⚠️ Skipping ${row.url}: No snapshot URL.`);
        continue;
      }

      const snapshotUrl = scanData.snapshot;
      console.log(`🌐 Visiting: ${row.url} (${snapshotUrl})`);

      try {
        const response = await axios.get(snapshotUrl, { timeout: 30000 });
        const html = response.data;
        const $ = cheerio.load(html);
        
        let realTitle = $('title').text().trim();
        
        if (!realTitle) {
           // Fallback to H1 if title is missing
           realTitle = $('h1').first().text().trim();
        }

        if (realTitle) {
           // Update DB
           await client.query(`
             UPDATE scanned_urls 
             SET title = $1, 
                 source = 'Hunter/Wayback'
             WHERE id = $2
           `, [realTitle, row.id]);
           
           console.log(`   ✅ Title Found: "${realTitle}"`);
           successCount++;
        } else {
           console.log(`   ⚠️ No title found in HTML.`);
        }

      } catch (err) {
        console.error(`   ❌ Failed to fetch: ${err.message}`);
        errorCount++;
      }
      
      // Be nice to the Wayback Machine API
      await new Promise(r => setTimeout(r, 1000));
    }

    console.log(`\n🎉 Enrichment Complete.`);
    console.log(`   ✨ Updated: ${successCount}`);
    console.log(`   ❌ Errors: ${errorCount}`);

  } catch (err) {
    console.error('Critical Error:', err);
  } finally {
    await client.end();
  }
}

enrichData();
