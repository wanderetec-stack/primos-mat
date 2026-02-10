
import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load env vars
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const { DATABASE_URL } = process.env;

if (!DATABASE_URL) {
  console.error('DATABASE_URL not found in .env');
  process.exit(1);
}

const client = new pg.Client({
  connectionString: DATABASE_URL,
});

async function setup() {
  try {
    await client.connect();
    console.log('Connected to Supabase Postgres...');

    // 1. Create scanned_urls table (Recon System)
    await client.query(`
      CREATE TABLE IF NOT EXISTS scanned_urls (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        url TEXT NOT NULL,
        status TEXT,
        title TEXT,
        source TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        scan_data JSONB
      );
    `);
    console.log('Table scanned_urls ready.');

    // 2. Create dossier_entries table (Dossiê Matemático)
    await client.query(`
      CREATE TABLE IF NOT EXISTS dossier_entries (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        number TEXT NOT NULL,
        is_prime BOOLEAN,
        factors TEXT[],
        ai_insight JSONB,
        execution_time NUMERIC,
        timestamp BIGINT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    console.log('Table dossier_entries ready.');

    // 3. Enable RLS (Security) but allow Anon access for now (since we use Anon key in frontend)
    // Note: In production, you'd want stricter policies.
    await client.query(`
      ALTER TABLE scanned_urls ENABLE ROW LEVEL SECURITY;
      ALTER TABLE dossier_entries ENABLE ROW LEVEL SECURITY;
    `);

    // Create Policies for Anon access (Select/Insert)
    // Drop existing policies to avoid errors if re-running
    await client.query(`
      DROP POLICY IF EXISTS "Public Read scanned_urls" ON scanned_urls;
      DROP POLICY IF EXISTS "Public Insert scanned_urls" ON scanned_urls;
      DROP POLICY IF EXISTS "Public Read dossier_entries" ON dossier_entries;
      DROP POLICY IF EXISTS "Public Insert dossier_entries" ON dossier_entries;
    `);

    await client.query(`
      CREATE POLICY "Public Read scanned_urls" ON scanned_urls FOR SELECT USING (true);
      CREATE POLICY "Public Insert scanned_urls" ON scanned_urls FOR INSERT WITH CHECK (true);
      
      CREATE POLICY "Public Read dossier_entries" ON dossier_entries FOR SELECT USING (true);
      CREATE POLICY "Public Insert dossier_entries" ON dossier_entries FOR INSERT WITH CHECK (true);
    `);
    
    console.log('RLS Policies applied (Public Read/Write for Anon).');

  } catch (err) {
    console.error('Database Setup Error:', err);
  } finally {
    await client.end();
  }
}

setup();
