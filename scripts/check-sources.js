
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function checkSources() {
    // Check sources for files in /dados/ or ending in .7z
    const { data, error } = await supabase
        .from('scanned_urls')
        .select('source, url')
        .or('url.ilike.%.7z%,url.ilike.%/dados/%')
        .limit(1000);

    if (error) {
        console.error(error);
        return;
    }

    // Group by source
    const sources = {};
    data.forEach(item => {
        if (!sources[item.source]) sources[item.source] = 0;
        sources[item.source]++;
    });

    console.log('Sources pointing to /dados/ or .7z files:');
    console.log(JSON.stringify(sources, null, 2));
}

checkSources();
