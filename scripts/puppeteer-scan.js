
import puppeteer from 'puppeteer';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const TARGET_DOMAIN = 'primos.mat.br';
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function searchDuckDuckGo(query) {
    console.log(`[PUPPETEER] Launching browser for query: ${query}`);
    const browser = await puppeteer.launch({ 
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox'] 
    });
    const page = await browser.newPage();
    
    // Set a real user agent
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    try {
        await page.goto(`https://duckduckgo.com/?q=${encodeURIComponent(query)}&t=h_&ia=web`, { waitUntil: 'networkidle2' });
        
        // Wait for results
        await page.waitForSelector('.react-results--main', { timeout: 10000 });

        const results = await page.evaluate((target) => {
            const items = [];
            document.querySelectorAll('article').forEach(article => {
                const linkEl = article.querySelector('a[data-testid="result-title-a"]');
                const titleEl = article.querySelector('h2');
                const snippetEl = article.querySelector('div[class*="result__snippet"]');
                
                if (linkEl && titleEl) {
                    const url = linkEl.href;
                    // Filter out own domain
                    if (!url.includes(target) && !url.includes('duckduckgo.com')) {
                        items.push({
                            url: url,
                            title: titleEl.innerText,
                            source: 'DuckDuckGo (Puppeteer)',
                            snippet: snippetEl ? snippetEl.innerText : ''
                        });
                    }
                }
            });
            return items;
        }, TARGET_DOMAIN);

        console.log(`[PUPPETEER] Found ${results.length} results.`);
        return results;

    } catch (err) {
        console.error('[PUPPETEER] Error:', err.message);
        return [];
    } finally {
        await browser.close();
    }
}

async function saveResults(results) {
    let newCount = 0;
    const { data: existing } = await supabase.from('scanned_urls').select('url').eq('status', 'referencia_externa');
    const existingSet = new Set(existing ? existing.map(e => e.url) : []);

    for (const res of results) {
        if (existingSet.has(res.url)) continue;

        const { error } = await supabase.from('scanned_urls').insert({
            url: res.url,
            title: res.title,
            source: res.source,
            status: 'referencia_externa',
            scan_data: { 
                found_at: new Date().toISOString(),
                snippet: res.snippet,
                scanner: 'puppeteer-v1'
            }
        });

        if (!error) newCount++;
    }
    return newCount;
}

async function run() {
    console.log('--- STARTING PUPPETEER SCAN ---');
    const query = `"${TARGET_DOMAIN}" -site:${TARGET_DOMAIN}`;
    const results = await searchDuckDuckGo(query);
    const saved = await saveResults(results);
    console.log(`Saved ${saved} new external references.`);
    console.log('--- SCAN COMPLETE ---');
}

run();
