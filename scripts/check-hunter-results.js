import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Client } = pkg;

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function checkHunter() {
  await client.connect();
  const res = await client.query("SELECT COUNT(*) FROM scanned_urls WHERE source = 'Hunter Module'");
  console.log('🏹 Hunter Module Results:', res.rows[0].count);
  await client.end();
}

checkHunter();
