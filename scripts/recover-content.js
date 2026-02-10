
import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';
import * as cheerio from 'cheerio';

// Setup Env
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const { DATABASE_URL } = process.env;

if (!DATABASE_URL) {
  console.error('DATABASE_URL missing');
  process.exit(1);
}

const client = new pg.Client({ connectionString: DATABASE_URL });

async function recoverContent() {
  try {
    await client.connect();
    console.log('🔍 [ARCHAEOLOGIST] Connected to Database.');

    // 1. Get unique 404 URLs from traffic_logs that are NOT yet in scanned_urls
    // (We only want to process new discoveries)
    const { rows: newTargets } = await client.query(`
      SELECT DISTINCT url FROM traffic_logs
      WHERE url NOT IN (SELECT url FROM scanned_urls)
      LIMIT 10
    `);

    if (newTargets.length === 0) {
      console.log('✅ [ARCHAEOLOGIST] No new 404s to investigate.');
      return;
    }

    console.log(`🧐 [ARCHAEOLOGIST] Investigating ${newTargets.length} new targets...`);

    for (const target of newTargets) {
      const fullUrl = `https://primos.mat.br${target.url}`;
      console.log(`   > Checking Wayback Machine for: ${fullUrl}`);

      try {
        // 2. Ask Wayback Machine if they have it
        const wbApi = `http://archive.org/wayback/available?url=${fullUrl}`;
        const { data: wbData } = await axios.get(wbApi);

        if (wbData.archived_snapshots && wbData.archived_snapshots.closest) {
          const snapshotUrl = wbData.archived_snapshots.closest.url;
          const timestamp = wbData.archived_snapshots.closest.timestamp;
          console.log(`     ✅ FOUND! Snapshot from ${timestamp}`);
          console.log(`     ⬇️ Downloading content...`);

          // 3. Download the snapshot
          const { data: html } = await axios.get(snapshotUrl);
          const $ = cheerio.load(html);
          const title = $('title').text().trim() || 'Sem Título Detectado';
          
          console.log(`     📄 Recovered Title: "${title}"`);

          // 4. Save to scanned_urls (The Dossier)
          await client.query(`
            INSERT INTO scanned_urls (url, status, title, source, scan_data)
            VALUES ($1, $2, $3, $4, $5)
          `, [
            target.url,
            'recuperado',
            title,
            'Wayback Machine',
            JSON.stringify({ snapshot: snapshotUrl, timestamp, original_url: fullUrl })
          ]);

        } else {
          console.log(`     ❌ Not found in Archive. Marking as 'lost'.`);
          await client.query(`
            INSERT INTO scanned_urls (url, status, title, source)
            VALUES ($1, $2, $3, $4)
          `, [target.url, 'perdido', 'Conteúdo Irrecuperável', 'N/A']);
        }

      } catch (err) {
        console.error(`     ⚠️ Error processing ${target.url}:`, err.message);
      }
    }

  } catch (err) {
    console.error('Fatal Error:', err);
  } finally {
    await client.end();
  }
}

recoverContent();
