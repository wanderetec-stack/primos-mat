import axios from 'axios';
import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Client } = pkg;
const TARGET_DOMAIN = 'primos.mat.br';
// Limit set to 5,000,000 for massive deep archival dig
const CDX_API = `https://web.archive.org/cdx/search/cdx?url=${TARGET_DOMAIN}/*&output=json&limit=5000000`;

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function hunterGatherer() {
  console.log('🏹 Hunter-Gatherer Module Initiated (MASSIVE MODE)...');
  console.log(`🌍 Target Domain: ${TARGET_DOMAIN}`);
  console.log('🚀 Capacity: 5,000,000 records');
  console.log('⏳ Querying Wayback Machine CDX Index...');

  try {
    const response = await axios.get(CDX_API, { 
      timeout: 300000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; PrimosMatBot/1.0; +https://primos.mat.br)'
      }
    });
    const data = response.data;

    if (!data || data.length === 0) {
      console.log('❌ No historical records found.');
      return;
    }

    // Remove header row
    const rows = data.slice(1);
    console.log(`📦 Found ${rows.length} historical records.`);

    // Deduplicate
    const uniqueTargets = new Map();

    rows.forEach(row => {
      try {
          const timestamp = row[1];
          const original = row[2];
          const mimetype = row[3];
          const status = row[4];

          // Filter: Only HTML and Success (200)
          if (mimetype !== 'text/html') return;
          if (status !== '200') return;

          // Filter: Noise
          if (original.includes('wp-admin') || original.includes('feed') || original.includes('xmlrpc') || original.includes('?')) return;

          if (!uniqueTargets.has(original)) {
            uniqueTargets.set(original, {
              url: original,
              timestamp: timestamp,
              snapshot: `http://web.archive.org/web/${timestamp}/${original}`
            });
          }
      } catch (e) { }
    });

    console.log(`🎯 Identified ${uniqueTargets.size} unique valid HTML targets.`);

    // Connect to DB
    await client.connect();

    let newCount = 0;
    let skipCount = 0;

    for (const [url, info] of uniqueTargets) {
      let path = url.replace(/^https?:\/\/[^\/]+/, '');
      if (path === '') path = '/';
      if (path === '/') continue;

      try {
        // Check if exists first to avoid constraint errors
        const check = await client.query('SELECT id FROM scanned_urls WHERE url = $1', [path]);
        if (check.rows.length > 0) {
            skipCount++;
            continue;
        }

        const res = await client.query(`
          INSERT INTO scanned_urls (url, title, source, status, scan_data, created_at)
          VALUES ($1, $2, $3, $4, $5, NOW())
          RETURNING id
        `, [
          path, 
          'Recuperado via Hunter', 
          'Hunter Module',
          'recuperado', 
          JSON.stringify({ snapshot: info.snapshot, timestamp: info.timestamp })
        ]);

        if (res.rowCount > 0) {
            newCount++;
            process.stdout.write('+');
        }
      } catch (err) {
        // console.error(`Insert error: ${err.message}`);
      }
    }

    console.log(`\n\n✅ Hunter Run Complete.`);
    console.log(`   🆕 New Targets: ${newCount}`);
    console.log(`   ⏭️  Skipped: ${skipCount}`);

  } catch (err) {
    console.error('❌ Critical Hunter Error:', err.message);
  } finally {
    await client.end();
  }
}

hunterGatherer();
