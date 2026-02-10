import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const TARGET_DOMAIN = 'primos.mat.br';

async function extractTargets() {
    console.log('[TARGET-EXTRACTOR] Starting analysis of GitHub references...');
    const token = process.env.GITHUB_TOKEN;
    
    if (!token) {
        console.log('[TARGET-EXTRACTOR] Error: No GITHUB_TOKEN found.');
        return;
    }

    try {
        // 1. Search for files
        console.log('[TARGET-EXTRACTOR] Fetching file list...');
        const searchResponse = await axios.get(`https://api.github.com/search/code?q="${TARGET_DOMAIN}"`, {
            headers: { 
                'User-Agent': 'PrimosMat-Recon',
                'Accept': 'application/vnd.github.v3+json',
                'Authorization': `Bearer ${token}`
            }
        });
        
        const items = searchResponse.data.items || [];
        console.log(`[TARGET-EXTRACTOR] Analyzing content of ${items.length} files...\n`);

        const results = [];

        // 2. Process each file
        for (const item of items) {
            // Convert blob URL to raw URL
            // From: https://github.com/user/repo/blob/sha/path
            // To:   https://raw.githubusercontent.com/user/repo/sha/path
            const rawUrl = item.html_url
                .replace('github.com', 'raw.githubusercontent.com')
                .replace('/blob/', '/');

            try {
                const contentResponse = await axios.get(rawUrl);
                const content = typeof contentResponse.data === 'string' 
                    ? contentResponse.data 
                    : JSON.stringify(contentResponse.data);

                // Regex to find links to primos.mat.br
                // Matches http://primos.mat.br/something or https://... or just primos.mat.br/something
                const regex = /(https?:\/\/)?primos\.mat\.br\/[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]*/gi;
                const matches = content.match(regex) || [];

                // Filter out just the domain itself if possible, we want paths
                const uniqueTargets = [...new Set(matches)];

                if (uniqueTargets.length > 0) {
                    results.push({
                        repo: item.repository.full_name,
                        file: item.path,
                        targets: uniqueTargets
                    });
                    console.log(`✅ [${item.repository.full_name}] found targets:`);
                    uniqueTargets.forEach(t => console.log(`   -> ${t}`));
                } else {
                    console.log(`⚠️ [${item.repository.full_name}] mentioned domain but no specific URL found in regex scan.`);
                }

            } catch (err) {
                console.error(`❌ [${item.repository.full_name}] Failed to fetch raw content: ${err.message}`);
            }
        }

        console.log('\n--- SUMMARY REPORT ---');
        console.log('Source Repository -> Target URL (What we need to restore)');
        console.log('---------------------------------------------------------');
        results.forEach(r => {
            r.targets.forEach(t => {
                console.log(`${r.repo} -> ${t}`);
            });
        });

    } catch (err) {
        console.error('[TARGET-EXTRACTOR] Critical Error:', err.message);
    }
}

extractTargets();
