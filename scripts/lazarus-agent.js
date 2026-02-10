import pkg from 'pg';
import dotenv from 'dotenv';
import axios from 'axios';
import * as cheerio from 'cheerio';
import TurndownService from 'turndown';

dotenv.config();

const { Client } = pkg;
const turndownService = new TurndownService();

// Config
const BATCH_SIZE = 50;

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function fetchWaybackContent(snapshotUrl) {
  try {
    console.log(`   ⏳ Fetching snapshot: ${snapshotUrl}...`);
    const { data: html } = await axios.get(snapshotUrl);
    const $ = cheerio.load(html);

    // Remove clutter
    $('script, style, nav, footer, iframe, .ad, .advertisement, #header, #footer').remove();

    // Try to find the main content
    // Primos.mat.br old structure might use specific classes, but generic fallback is needed
    const contentSelectors = ['article', 'main', '#content', '.post-content', '.entry-content', 'body'];
    let contentHtml = '';

    for (const selector of contentSelectors) {
      if ($(selector).length > 0) {
        contentHtml = $(selector).html();
        break;
      }
    }

    if (!contentHtml) contentHtml = $('body').html();

    const title = $('title').text().trim() || 'Sem Título';
    const markdown = turndownService.turndown(contentHtml);

    return { title, markdown };
  } catch (err) {
    console.error(`   ❌ Failed to fetch snapshot: ${err.message}`);
    return null;
  }
}

// AI Placeholder - This is where the magic will happen in Phase 4.5
async function enhanceContentWithAI(rawMarkdown) {
  // TODO: Integrate Gemini/OpenAI here
  // For now, we return the raw recovered content with a header
  return `> ⚠️ **RASCUNHO AUTOMÁTICO (PROTOCOLO LÁZARO)**
> Este conteúdo foi recuperado do Wayback Machine e convertido para Markdown.
> Necessita revisão humana ou processamento de IA para atualização.

${rawMarkdown}`;
}

async function runLazarusAgent() {
  try {
    await client.connect();
    console.log('👻 Lazarus Agent Started...');

    // 1. Find targets: Recovered URLs that are NOT yet in drafts
    const { rows: targets } = await client.query(`
      SELECT s.url, s.scan_data 
      FROM scanned_urls s
      LEFT JOIN draft_articles d ON s.url = d.original_url
      WHERE s.status = 'recuperado' 
      AND d.id IS NULL
      LIMIT $1
    `, [BATCH_SIZE]);

    if (targets.length === 0) {
      console.log('zzz Nenhum novo artigo recuperado para processar.');
      return;
    }

    console.log(`🎯 Encontrados ${targets.length} candidatos para reconstrução.`);

    for (const target of targets) {
      console.log(`\n💀 Revivendo: ${target.url}`);
      
      const scanData = target.scan_data; // JSON object
      // Handle case where scan_data might be a string or object depending on driver
      const dataObj = typeof scanData === 'string' ? JSON.parse(scanData) : scanData;
      
      if (!dataObj || !dataObj.snapshot) {
        console.log('   ⚠️ No snapshot URL found. Skipping.');
        continue;
      }

      // 2. Fetch and Extract
      const extracted = await fetchWaybackContent(dataObj.snapshot);
      if (!extracted) continue;

      // 3. Enhance (AI)
      const finalContent = await enhanceContentWithAI(extracted.markdown);

      // 4. Save Draft
      await client.query(`
        INSERT INTO draft_articles (original_url, title, content_markdown, status)
        VALUES ($1, $2, $3, 'draft')
      `, [target.url, extracted.title, finalContent]);

      console.log('   ✨ Draft saved successfully!');
    }

  } catch (err) {
    console.error('❌ Lazarus Agent Error:', err);
  } finally {
    await client.end();
    console.log('👻 Agent Finished.');
  }
}

runLazarusAgent();
