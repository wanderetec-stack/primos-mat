
import axios from 'axios';
import * as cheerio from 'cheerio';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// --- Configuration ---
const TARGET_DOMAIN = 'primos.mat.br';
// Wikipedia requires a specific User-Agent format: AppName/Version (URL; Contact)
const USER_AGENT = 'PrimosMatBot/1.0 (https://primos.mat.br; contato@primos.mat.br)';

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// 1. DuckDuckGo Scraper (HTML)
async function searchDuckDuckGo() {
    console.log('[BACKLINK-HUNTER] Searching DuckDuckGo...');
    const query = `"${TARGET_DOMAIN}" -site:${TARGET_DOMAIN}`;
    const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
    
    try {
        const { data } = await axios.get(url, {
            headers: { 'User-Agent': USER_AGENT }
        });
        
        const $ = cheerio.load(data);
        const results = [];
        
        $('.result__a').each((i, el) => {
            const link = $(el).attr('href');
            const title = $(el).text();
            if (link && !link.includes('duckduckgo.com') && !link.includes(TARGET_DOMAIN)) {
                results.push({
                    url: link,
                    title: title,
                    source: 'DuckDuckGo Search'
                });
            }
        });
        
        console.log(`[BACKLINK-HUNTER] DDG found ${results.length} results.`);
        return results;
    } catch (err) {
        console.error('[BACKLINK-HUNTER] DDG Error:', err.message);
        return [];
    }
}

// 2. Wikipedia API (Backlinks)
async function searchWikipedia() {
    console.log('[BACKLINK-HUNTER] Searching Wikipedia...');
    // Search for text "primos.mat.br" in all wikis (using en and pt as base)
    const endpoints = [
        'https://pt.wikipedia.org/w/api.php',
        'https://en.wikipedia.org/w/api.php'
    ];
    
    let allResults = [];
    
    for (const endpoint of endpoints) {
        try {
            const { data } = await axios.get(endpoint, {
                params: {
                    action: 'query',
                    list: 'search',
                    srsearch: `"${TARGET_DOMAIN}"`,
                    format: 'json'
                }
            });
            
            if (data.query && data.query.search) {
                const wikiResults = data.query.search.map(item => ({
                    url: endpoint.replace('/w/api.php', `/wiki/${encodeURIComponent(item.title.replace(/ /g, '_'))}`),
                    title: `Wikipedia: ${item.title}`,
                    source: 'Wikipedia'
                }));
                allResults = [...allResults, ...wikiResults];
            }
        } catch (err) {
            console.error(`[BACKLINK-HUNTER] Wiki Error (${endpoint}):`, err.message);
        }
    }
    
    console.log(`[BACKLINK-HUNTER] Wikipedia found ${allResults.length} results.`);
    return allResults;
}

// 3. GitHub Code Search
async function searchGitHub() {
    console.log('[BACKLINK-HUNTER] Searching GitHub Code...');
    const token = process.env.GITHUB_TOKEN;
    
    if (!token) {
        console.log('[BACKLINK-HUNTER] SKIPPING GitHub: No GITHUB_TOKEN in .env');
        return [];
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
            const results = response.data.items.map(item => ({
                url: item.html_url,
                title: `GitHub: ${item.repository.full_name} (${item.path})`,
                source: 'GitHub Code'
            }));
            console.log(`[BACKLINK-HUNTER] GitHub found ${results.length} results.`);
            return results;
        }
    } catch (err) {
        // GitHub rate limits are strict for unauth
        console.error('[BACKLINK-HUNTER] GitHub Error:', err.message);
    }
    return [];
}

// 4. Save to DB
async function saveBacklinks(results) {
    let newCount = 0;
    
    // Get existing external references
    const { data: existing } = await supabase
        .from('scanned_urls')
        .select('url')
        .eq('status', 'referencia_externa');
        
    const existingSet = new Set(existing ? existing.map(e => e.url) : []);

    for (const result of results) {
        if (existingSet.has(result.url)) continue;

        // Ensure we aren't adding our own domain
        if (result.url.includes('primos.mat.br')) continue;

        const { error } = await supabase.from('scanned_urls').insert({
            url: result.url,
            title: result.title || 'External Reference',
            source: result.source,
            status: 'referencia_externa',
            scan_data: { 
                found_at: new Date().toISOString(),
                scanner: 'backlink-hunter-v1',
                target: TARGET_DOMAIN
            }
        });

        if (!error) {
            newCount++;
            existingSet.add(result.url);
        } else {
             if (error.code !== '23505') console.error('DB Error:', error.message);
        }
    }
    
    return newCount;
}

async function run() {
    console.log('--- STARTING GLOBAL BACKLINK HUNTER ---');
    
    const ddg = await searchDuckDuckGo();
    await sleep(2000);
    const wiki = await searchWikipedia();
    await sleep(2000);
    const github = await searchGitHub();
    
    const all = [...ddg, ...wiki, ...github];
    console.log(`[BACKLINK-HUNTER] Total potential backlinks found: ${all.length}`);
    
    const saved = await saveBacklinks(all);
    console.log(`[BACKLINK-HUNTER] New backlinks saved to DB: ${saved}`);
    
    console.log('--- SCAN COMPLETE ---');
}

run();
