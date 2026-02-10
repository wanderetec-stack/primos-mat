import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();
const { Client } = pkg;

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function injectSuccess() {
  await client.connect();
  
  // A real snapshot from example.com to test extraction
  const testSnapshot = "https://web.archive.org/web/20231101000000/https://example.com/";
  
  try {
    // Clean up previous test
    await client.query("DELETE FROM scanned_urls WHERE url = '/example-recovery-test'");

    await client.query(`
      INSERT INTO scanned_urls (url, status, title, source, scan_data)
      VALUES ($1, 'recuperado', 'Example Domain Recovery', 'Simulated Injection', $2)
    `, ['/example-recovery-test', JSON.stringify({ snapshot: testSnapshot })]);
    
    console.log('✅ Injected simulated recovery success.');
  } catch (e) {
    console.error(e);
  } finally {
    await client.end();
  }
}

injectSuccess();
