import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function publishAllDrafts() {
    console.log('[PUBLISHER] Starting bulk publish process...');

    // 1. Fetch all non-published drafts
    const { data: drafts, error } = await supabase
        .from('draft_articles')
        .select('*')
        .neq('status', 'published');

    if (error) {
        console.error('[PUBLISHER] Error fetching drafts:', error.message);
        return;
    }

    if (!drafts || drafts.length === 0) {
        console.log('[PUBLISHER] No pending drafts found to publish.');
        return;
    }

    console.log(`[PUBLISHER] Found ${drafts.length} pending drafts. Reviewing and publishing...`);

    let successCount = 0;

    // 2. Process each draft
    for (const draft of drafts) {
        // "Review" Logic: Ensure title and content are valid
        let cleanTitle = draft.title || 'Untitled Article';
        
        // Remove Wayback Machine artifacts from title if present
        cleanTitle = cleanTitle.replace(/Wayback Machine/g, '').trim();
        cleanTitle = cleanTitle.replace(/Internet Archive/g, '').trim();
        if (cleanTitle.endsWith('-')) cleanTitle = cleanTitle.slice(0, -1).trim();

        // Ensure we have minimal content
        let cleanContent = draft.content || '';
        if (cleanContent.length < 50) {
            cleanContent = `
# ${cleanTitle}

*Nota do Editor: Este artigo foi recuperado automaticamente dos arquivos históricos do Primos.mat.br. O conteúdo original pode estar incompleto.*

${cleanContent}
            `;
        }

        // Add automatic category tag if missing
        const tags = draft.tags || [];
        if (!tags.includes('Arquivo Histórico')) tags.push('Arquivo Histórico');

        // Update in DB
        const { error: updateError } = await supabase
            .from('draft_articles')
            .update({
                status: 'published',
                title: cleanTitle,
                content: cleanContent,
                tags: tags,
                published_at: new Date().toISOString()
            })
            .eq('id', draft.id);

        if (updateError) {
            console.error(`[PUBLISHER] Failed to publish "${draft.title}":`, updateError.message);
        } else {
            console.log(`✅ Published: ${cleanTitle}`);
            successCount++;
        }
    }

    console.log(`\n[PUBLISHER] Operation Complete. Successfully published ${successCount} articles.`);
}

publishAllDrafts();
