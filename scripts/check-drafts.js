import pkg from 'pg';
import dotenv from 'dotenv';
dotenv.config();
const { Client } = pkg;
const client = new Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

async function checkDrafts() {
  await client.connect();
  const res = await client.query("SELECT * FROM draft_articles");
  console.log('Drafts count:', res.rowCount);
  if (res.rowCount > 0) {
    console.log('Sample:', res.rows[0].title);
  }
  await client.end();
}
checkDrafts();
