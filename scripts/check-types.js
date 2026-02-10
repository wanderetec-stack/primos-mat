
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function checkNon7z() {
    const { data, error } = await supabase
        .from('scanned_urls')
        .select('url')
        .eq('status', 'novo_candidato')
        .not('url', 'ilike', '%.7z%') // Exclude .7z
        .limit(20);

    if (error) {
        console.error(error);
    } else {
        console.log('Non-7z files found:', data);
    }
}

checkNon7z();
