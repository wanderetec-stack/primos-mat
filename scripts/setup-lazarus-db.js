import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Client } = pkg;

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function setupLazarusDB() {
  try {
    await client.connect();
    console.log('🔌 Connected to Supabase (Lazarus Protocol)...');

    // Create Drafts Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS draft_articles (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        original_url TEXT UNIQUE NOT NULL,
        title TEXT NOT NULL,
        content_markdown TEXT,
        status TEXT DEFAULT 'draft', -- draft, review, published
        source TEXT DEFAULT 'Lazarus Agent',
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    console.log('✅ Table "draft_articles" is ready.');

    // Enable RLS
    await client.query(`ALTER TABLE draft_articles ENABLE ROW LEVEL SECURITY;`);
    
    // Policy: Allow Public Read (for Dashboard)
    await client.query(`
      DO $$ 
      BEGIN
        IF NOT EXISTS (
          SELECT FROM pg_policies WHERE tablename = 'draft_articles' AND policyname = 'Allow Public Read Drafts'
        ) THEN
          CREATE POLICY "Allow Public Read Drafts" ON draft_articles FOR SELECT USING (true);
        END IF;
      END $$;
    `);

    // Policy: Allow Service Role/Anon Insert (for Script)
    await client.query(`
      DO $$ 
      BEGIN
        IF NOT EXISTS (
          SELECT FROM pg_policies WHERE tablename = 'draft_articles' AND policyname = 'Allow Insert Drafts'
        ) THEN
          CREATE POLICY "Allow Insert Drafts" ON draft_articles FOR INSERT WITH CHECK (true);
        END IF;
      END $$;
    `);
    
    console.log('🛡️ RLS Policies configured for Lazarus.');

  } catch (err) {
    console.error('❌ Error setting up Lazarus DB:', err);
  } finally {
    await client.end();
    console.log('🔌 Disconnected.');
  }
}

setupLazarusDB();
