import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const TARGET_DOMAIN = 'primos.mat.br';

async function searchGitHub() {
    console.log('[GITHUB-SCANNER] Searching GitHub Code...');
    const token = process.env.GITHUB_TOKEN;
    
    if (!token) {
        console.log('[GITHUB-SCANNER] SKIPPING: No GITHUB_TOKEN in .env');
        return;
    }

    try {
        const response = await axios.get(`https://api.github.com/search/code?q="${TARGET_DOMAIN}"`, {
            headers: { 
                'User-Agent': 'PrimosMat-Recon',
                'Accept': 'application/vnd.github.v3+json',
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.data && response.data.items) {
            console.log(`\n[GITHUB-SCANNER] Found ${response.data.items.length} results:\n`);
            
            response.data.items.forEach((item, index) => {
                console.log(`${index + 1}. [${item.repository.full_name}]`);
                console.log(`   File: ${item.path}`);
                console.log(`   URL: ${item.html_url}`);
                console.log('---');
            });
        } else {
            console.log('[GITHUB-SCANNER] No results found.');
        }
    } catch (err) {
        console.error('[GITHUB-SCANNER] Error:', err.message);
        if (err.response) {
             console.error('Status:', err.response.status);
             console.error('Data:', err.response.data);
        }
    }
}

searchGitHub();
