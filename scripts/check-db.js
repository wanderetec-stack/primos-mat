
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function check() {
    // Check scanned_urls
    const { data, error, count } = await supabase
        .from('scanned_urls')
        .select('*', { count: 'exact', head: true });
        
    if (error) {
        console.error('Error:', error);
    } else {
        console.log('Total scanned_urls in DB:', count);
    }
}

check();
