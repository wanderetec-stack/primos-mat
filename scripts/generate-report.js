
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function generateReport() {
    console.log('Generating report from DB...');
    
    // Fetch items added in the last hour (assuming scan ran recently)
    // Or just filter by status if we used a unique status
    const { data, error } = await supabase
        .from('scanned_urls')
        .select('*')
        .eq('status', 'novo_candidato')
        .limit(100);

    if (error) {
        console.error('Error fetching data:', error);
        return;
    }

    const { count } = await supabase
        .from('scanned_urls')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'novo_candidato');

    console.log(`Found ${count} new candidates.`);

    const report = {
        timestamp: new Date().toISOString(),
        total_new_findings: count,
        sample_findings: data.map(item => ({
            url: item.url,
            source: item.source,
            found_at: item.created_at
        }))
    };

    fs.writeFileSync('mega-scan-report.json', JSON.stringify(report, null, 2));
    console.log('Report saved to mega-scan-report.json');
}

generateReport();
