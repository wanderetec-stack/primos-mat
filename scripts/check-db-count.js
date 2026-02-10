import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Client } = pkg;

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function checkCount() {
  try {
    await client.connect();
    const res = await client.query('SELECT COUNT(*) FROM scanned_urls');
    console.log(`Current record count: ${res.rows[0].count}`);
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await client.end();
  }
}

checkCount();
