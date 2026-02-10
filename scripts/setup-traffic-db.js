
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

async function setupTrafficDb() {
  try {
    await client.connect();
    console.log('Connected to Supabase Postgres...');

    // Create traffic_logs table
    await client.query(`
      CREATE TABLE IF NOT EXISTS traffic_logs (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        url TEXT NOT NULL,
        referrer TEXT,
        user_agent TEXT,
        ip TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    console.log('Table traffic_logs ready.');

    // Enable RLS
    await client.query(`
      ALTER TABLE traffic_logs ENABLE ROW LEVEL SECURITY;
    `);

    // Policies
    await client.query(`
      DROP POLICY IF EXISTS "Public Read traffic_logs" ON traffic_logs;
      DROP POLICY IF EXISTS "Public Insert traffic_logs" ON traffic_logs;
    `);

    await client.query(`
      CREATE POLICY "Public Read traffic_logs" ON traffic_logs FOR SELECT USING (true);
      CREATE POLICY "Public Insert traffic_logs" ON traffic_logs FOR INSERT WITH CHECK (true);
    `);
    
    console.log('RLS Policies applied to traffic_logs.');

  } catch (err) {
    console.error('Database Setup Error:', err);
  } finally {
    await client.end();
  }
}

setupTrafficDb();
