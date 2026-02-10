
import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const { DATABASE_URL } = process.env;

const client = new pg.Client({ connectionString: DATABASE_URL });

async function update() {
  try {
    await client.connect();
    console.log('Connected for update...');

    // Create recon_scans table for Dashboard Summary
    await client.query(`
      CREATE TABLE IF NOT EXISTS recon_scans (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        total_links INT,
        status TEXT,
        results_json JSONB
      );
    `);
    console.log('Table recon_scans created.');

    // RLS
    await client.query(`ALTER TABLE recon_scans ENABLE ROW LEVEL SECURITY;`);
    await client.query(`DROP POLICY IF EXISTS "Public Read recon_scans" ON recon_scans;`);
    await client.query(`DROP POLICY IF EXISTS "Public Insert recon_scans" ON recon_scans;`);
    await client.query(`CREATE POLICY "Public Read recon_scans" ON recon_scans FOR SELECT USING (true);`);
    await client.query(`CREATE POLICY "Public Insert recon_scans" ON recon_scans FOR INSERT WITH CHECK (true);`);

    console.log('Policies updated.');

  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

update();
