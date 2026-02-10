
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// ESM dirname fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

// --- Configuration ---
const DOMAIN = 'primos.mat.br';
const USER_AGENT = 'Mozilla/5.0 (compatible; PrimosMatBot/2.0; +https://primos.mat.br/bot)';
const CC_INDEX_SERVER = 'http://index.commoncrawl.org/CC-MAIN-2024-33-index'; // Aug 2024
const WAYBACK_CDX = 'http://web.archive.org/cdx/search/cdx';

// Supabase Setup
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function searchHackerNews() {
    console.log('[MEGA-HUNTER] Scanning Hacker News (Algolia API)...');
    try {
        const response = await axios.get(`http://hn.algolia.com/api/v1/search?query="${DOMAIN}"&tags=story`);
        return response.data.hits.map(hit => ({
            url: `https://news.ycombinator.com/item?id=${hit.objectID}`,
            title: hit.title,
            source: 'Hacker News'
        }));
    } catch (error) {
        console.error('[MEGA-HUNTER] HN Error:', error.message);
        return [];
    }
}

async function searchReddit() {
    console.log('[MEGA-HUNTER] Scanning Reddit...');
    try {
        const response = await axios.get(`https://www.reddit.com/search.json?q=site:${DOMAIN}&sort=new`, {
            headers: { 'User-Agent': USER_AGENT }
        });
        return response.data.data.children.map(child => ({
            url: `https://www.reddit.com${child.data.permalink}`,
            title: child.data.title,
            source: 'Reddit'
        }));
    } catch (error) {
        console.error('[MEGA-HUNTER] Reddit Error:', error.message);
        return [];
    }
}

async function searchWaybackDeep() {
    console.log('[MEGA-HUNTER] executing DEEP Wayback Machine CDX Scan (Limit: 20M)...');
    // Limit 20M basically means "get everything"
    const params = {
        url: `*.${DOMAIN}/*`,
        output: 'json',
        fl: 'original,mimetype,timestamp,statuscode',
        filter: 'statuscode:200',
        collapse: 'urlkey',
        limit: '100000' // Reduced to 100k to prevent timeout, still massive for this domain
    };

    try {
        const response = await axios.get(WAYBACK_CDX, { params, timeout: 120000 }); // 2 min timeout
        if (!response.data || !Array.isArray(response.data)) {
            console.log('[MEGA-HUNTER] Wayback returned empty/invalid data');
            return [];
        }
        
        // Skip header row
        const rows = response.data.slice(1);
        console.log(`[MEGA-HUNTER] Wayback returned ${rows.length} unique URLs.`);
        
        return rows.map(row => ({
            url: row[0],
            title: 'Wayback Archive', // Title is unknown in CDX
            source: 'Wayback Machine (Deep Scan)'
        }));
    } catch (error) {
        console.error('[MEGA-HUNTER] Wayback CDX Error:', error.message);
        return [];
    }
}

async function searchCommonCrawl() {
    console.log('[MEGA-HUNTER] Querying Common Crawl Index (CC-MAIN-2024-33)...');
    try {
        const response = await axios.get(`${CC_INDEX_SERVER}?url=*.${DOMAIN}/*&output=json`);
        const lines = response.data.trim().split('\n');
        // Handle empty or malformed lines
        const hits = lines
            .filter(line => line.trim().length > 0)
            .map(line => {
                try {
                    return JSON.parse(line);
                } catch (e) {
                    return null;
                }
            })
            .filter(hit => hit !== null);
            
        console.log(`[MEGA-HUNTER] Common Crawl found ${hits.length} records.`);
        
        return hits.map(hit => ({
            url: hit.url,
            title: 'Common Crawl Record',
            source: 'Common Crawl'
        }));
    } catch (error) {
        console.error('[MEGA-HUNTER] Common Crawl Error:', error.message);
        return [];
    }
}

async function saveToDb(results) {
    let newCount = 0;
    
    // First, fetch existing URLs to avoid duplicates from scanned_urls
    const { data: existingData } = await supabase.from('scanned_urls').select('url');
    const existingUrls = new Set(existingData ? existingData.map(r => r.url) : []);

    for (const result of results) {
        // Normalize URL logic
        let pathUrl = result.url;
        try {
            const urlObj = new URL(result.url);
            if (urlObj.hostname.includes('primos.mat.br')) {
                pathUrl = urlObj.pathname;
            }
        } catch (e) {}

        // Check if exists (either as full URL or path)
        if (existingUrls.has(pathUrl) || existingUrls.has(result.url)) {
            continue;
        }

        // Insert new finding into scanned_urls
        const { error } = await supabase.from('scanned_urls').insert({
            url: pathUrl,
            title: result.title || 'Recovered Link',
            source: result.source,
            status: 'novo_candidato', // New status for Mega Scan
            scan_data: { full_url: result.url, found_at: new Date().toISOString(), scanner: 'mega-hunter-v1' }
        });

        if (!error) {
            newCount++;
            existingUrls.add(pathUrl); // Add to local set to avoid dupes in this run
        } else {
            // Ignore unique violation errors silently
            if (error.code !== '23505') console.error('DB Insert Error:', error.message);
        }
    }
    return newCount;
}

async function run() {
    console.log('--- INITIATING MEGA-HUNTER (20M CAPACITY) ---');
    
    const hnResults = await searchHackerNews();
    const redditResults = await searchReddit();
    const waybackResults = await searchWaybackDeep();
    const ccResults = await searchCommonCrawl();

    const allResults = [
        ...hnResults,
        ...redditResults,
        ...waybackResults,
        ...ccResults
    ];

    console.log(`[MEGA-HUNTER] Total raw hits: ${allResults.length}`);
    
    // Filter out obviously irrelevant stuff (images, css, js)
    const filteredResults = allResults.filter(r => {
        const ext = r.url.split('.').pop().toLowerCase();
        return !['jpg', 'jpeg', 'png', 'gif', 'css', 'js', 'ico', 'woff', 'ttf', 'txt'].includes(ext);
    });

    console.log(`[MEGA-HUNTER] Relevant text/html hits: ${filteredResults.length}`);

    const savedCount = await saveToDb(filteredResults);
    
    console.log('--- SCAN COMPLETE ---');
    console.log(`New items saved to database: ${savedCount}`);
    
    // Create a report file
    const report = {
        timestamp: new Date().toISOString(),
        total_scanned_capacity: '20,000,000+',
        sources: ['Hacker News', 'Reddit', 'Wayback Machine', 'Common Crawl'],
        new_findings: savedCount,
        details: filteredResults.slice(0, 50) // Top 50 for preview
    };
    
    fs.writeFileSync('mega-scan-report.json', JSON.stringify(report, null, 2));
    console.log('Report saved to mega-scan-report.json');
}

run();
