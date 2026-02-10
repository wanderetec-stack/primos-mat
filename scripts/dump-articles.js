
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing Supabase credentials in .env');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function dumpArticles() {
  console.log('Fetching published articles from Supabase...');
  
  const { data, error } = await supabase
    .from('draft_articles')
    .select('*')
    .eq('status', 'published');

  if (error) {
    console.error('Error fetching articles:', error);
    process.exit(1);
  }

  if (!data || data.length === 0) {
    console.warn('No published articles found.');
    return;
  }

  console.log(`Found ${data.length} articles.`);

  // Ensure directory exists
  const dataDir = path.resolve(__dirname, '../src/data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const filePath = path.join(dataDir, 'fallback_articles.json');
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  
  console.log(`Successfully saved articles to ${filePath}`);
}

dumpArticles();
