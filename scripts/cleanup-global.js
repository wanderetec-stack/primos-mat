import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Client } = pkg;

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function cleanup() {
  await client.connect();
  console.log('🧹 Cleaning up false positives from Global Scan...');
  
  // Delete entries where source is Wikipedia (API) but context doesn't contain 'primos.mat'
  // Or just delete the last batch if we can identify them.
  // Safer: Delete all 'Wikipedia (API)' entries and let the refined script re-add valid ones.
  
  const res = await client.query(`
    DELETE FROM scanned_urls 
    WHERE source = 'Wikipedia (API)'
  `);
  
  console.log(`Deleted ${res.rowCount} potential false positives.`);
  await client.end();
}

cleanup();
