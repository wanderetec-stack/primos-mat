import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Client } = pkg;

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function fixRLS() {
  console.log('🔧 Fixing RLS policies for draft_articles...');
  
  try {
    await client.connect();

    // 1. Enable RLS (idempotent)
    await client.query('ALTER TABLE draft_articles ENABLE ROW LEVEL SECURITY;');
    console.log('✅ RLS enabled on draft_articles.');

    // 2. Drop existing policy if exists to avoid conflict
    await client.query('DROP POLICY IF EXISTS "Public Read Access" ON draft_articles;');
    
    // 3. Create Policy for Public Read Access
    await client.query(`
      CREATE POLICY "Public Read Access" 
      ON draft_articles 
      FOR SELECT 
      TO anon, authenticated 
      USING (true);
    `);
    console.log('✅ "Public Read Access" policy created.');

  } catch (err) {
    console.error('❌ Error fixing RLS:', err);
  } finally {
    await client.end();
  }
}

fixRLS();
