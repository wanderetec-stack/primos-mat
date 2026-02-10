
import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const { DATABASE_URL } = process.env;

// If running in GitHub Actions, secrets might be passed differently, 
// but usually via env vars which dotenv picks up or are already in process.env

const RESULTS_PATH = path.join(__dirname, '../public/data/recon_results.json');

async function pushToDb() {
  if (!fs.existsSync(RESULTS_PATH)) {
    console.error('No results file found at:', RESULTS_PATH);
    process.exit(1);
  }

  const results = JSON.parse(fs.readFileSync(RESULTS_PATH, 'utf-8'));
  
  if (!DATABASE_URL) {
    console.error('DATABASE_URL is missing. Cannot push to DB.');
    process.exit(1);
  }

  const client = new pg.Client({ connectionString: DATABASE_URL });

  try {
    await client.connect();
    console.log('Connected to DB. Pushing results...');

    // Prepare data
    const totalLinks = results.totalLinks || 0;
    const status = results.status || 'Success';
    const resultsJson = results.recoveredArticles || [];

    // Insert
    await client.query(
      `INSERT INTO recon_scans (total_links, status, results_json, created_at)
       VALUES ($1, $2, $3, NOW())`,
      [totalLinks, status, JSON.stringify(resultsJson)]
    );

    console.log('Successfully pushed recon results to Supabase.');

  } catch (err) {
    console.error('Failed to push to DB:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

pushToDb();
