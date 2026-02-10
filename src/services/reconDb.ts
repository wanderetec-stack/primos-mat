import { createClient } from '@supabase/supabase-js';

export interface RecoveredArticle {
  url: string;
  title: string;
  source: string;
  status: string;
  scan_data?: any;
}

export interface DraftArticle {
  id: string;
  original_url: string;
  title: string;
  status: string;
  created_at: string;
  content_markdown?: string;
  meta_description?: string;
}

export interface ReconResult {
  lastScan: string;
  totalLinks: number;
  status: string;
  recoveredArticles: RecoveredArticle[];
  drafts: DraftArticle[];
}

interface ScannedUrl {
  url: string;
  title: string;
  source: string;
  status: string;
  scan_data: any;
}

// Environment variables should be in .env.local
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create Supabase client only if keys exist
export const supabase = SUPABASE_URL && SUPABASE_KEY 
  ? createClient(SUPABASE_URL, SUPABASE_KEY)
  : null;

// Service to fetch data (Hybrid: Supabase -> JSON Fallback)
export const ReconService = {
  async getDraftById(id: string): Promise<DraftArticle | null> {
    if (!supabase) return null;
    
    try {
      const { data, error } = await supabase
        .from('draft_articles')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      
      return data ? {
        id: data.id,
        original_url: data.original_url,
        title: data.title,
        status: data.status,
        created_at: data.created_at,
        content_markdown: data.content_markdown // Include content
      } as DraftArticle : null;
      
    } catch (err) {
      console.error('Error fetching draft:', err);
      return null;
    }
  },

  async saveDraft(id: string, content: string): Promise<boolean> {
    if (!supabase) return false;
    try {
      const { error } = await supabase
        .from('draft_articles')
        .update({ content_markdown: content, updated_at: new Date().toISOString() })
        .eq('id', id);
      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Error saving draft:', err);
      return false;
    }
  },

  async publishDraft(id: string): Promise<boolean> {
    if (!supabase) return false;
    try {
      const { error } = await supabase
        .from('draft_articles')
        .update({ status: 'published', updated_at: new Date().toISOString() })
        .eq('id', id);
      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Error publishing draft:', err);
      return false;
    }
  },

  async getPublishedArticleByUrl(pathname: string): Promise<DraftArticle | null> {
    if (!supabase) return null;
    try {
      // Try to find a published draft that ends with this pathname
      // Note: original_url is absolute (e.g. https://primos.mat.br/foo.html)
      // pathname is relative (e.g. /foo.html)
      
      const { data, error } = await supabase
        .from('draft_articles')
        .select('*')
        .eq('status', 'published')
        .ilike('original_url', `%${pathname}`)
        .limit(1);

      if (error) throw error;

      // Check if we have results
      if (data && data.length > 0) {
          const article = data[0];
          return {
            id: article.id,
            original_url: article.original_url,
            title: article.title,
            status: article.status,
            created_at: article.created_at,
            content_markdown: article.content_markdown
          } as DraftArticle;
      }
      
      return null;
    } catch (err) {
      console.error('Error fetching published article:', err);
      return null;
    }
  },

  async getPublishedArticles(): Promise<DraftArticle[]> {
    if (!supabase) return [];
    try {
      const { data, error } = await supabase
        .from('draft_articles')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(item => ({
        id: item.id,
        original_url: item.original_url,
        title: item.title,
        status: item.status,
        created_at: item.created_at,
        content_markdown: item.content_markdown
      }));
    } catch (err) {
      console.error('Error fetching published articles:', err);
      return [];
    }
  },

  async getLatestResults(): Promise<ReconResult> {
    // 1. Try Supabase first (if configured)
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('recon_scans')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        let detailedArticles: RecoveredArticle[] = [];
        let drafts: DraftArticle[] = [];
        
        // Fetch detailed items from scanned_urls (The Archaeologist's Findings)
        const { data: scanItems } = await supabase
          .from('scanned_urls')
          .select('*')
          .in('status', ['recuperado', 'referência_externa']) // Show recoveries and external references
          .order('created_at', { ascending: false })
          .limit(20);

        // Fetch Drafts
        const { data: draftItems } = await supabase
          .from('draft_articles')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10);

        // Fetch total count of recovered items
        const { count } = await supabase
          .from('scanned_urls')
          .select('*', { count: 'exact', head: true })
          .in('status', ['recuperado', 'referência_externa']);

        if (scanItems) {
            detailedArticles = scanItems.map((item: ScannedUrl) => ({
                url: item.url,
                title: item.title,
                source: item.source,
                status: item.status,
                scan_data: item.scan_data
            }));
        }

        if (draftItems) {
            drafts = draftItems.map((item: DraftArticle) => ({
                id: item.id,
                original_url: item.original_url,
                title: item.title,
                status: item.status,
                created_at: item.created_at
            }));
        }

        // We return data even if recon_scans is empty (using current scan items)
        if (scanItems || draftItems) {
             return {
                lastScan: data?.created_at || new Date().toISOString(),
                totalLinks: count || data?.total_links || 0,
                status: data?.status || 'Active (Hunter)',
                recoveredArticles: detailedArticles,
                drafts: drafts
             };
        }
        
        if (data && !error) {
          return {
            lastScan: data.created_at,
            totalLinks: data.total_links,
            status: data.status,
            // Prioritize Real DB findings over the summary JSON if available
            recoveredArticles: detailedArticles.length > 0 ? detailedArticles : data.results_json,
            drafts: drafts
          };
        }
        console.warn('Supabase returned error or no data, falling back to JSON:', error);
      } catch (err) {
        console.warn('Supabase connection failed, falling back to JSON:', err);
      }
    }

    // 2. Fallback to Local JSON (Generated by GitHub Actions)
    try {
      console.log('Fetching local JSON...');
      const response = await fetch('/data/recon_results.json?t=' + Date.now());
      if (!response.ok) throw new Error('Local JSON not found');
      return await response.json();
    } catch (error) {
      console.error('Recon Service Error (JSON):', error);
      // 3. Ultimate Fallback (Empty State)
      return {
        lastScan: new Date().toISOString(),
        totalLinks: 0,
        status: 'Offline / Error',
        recoveredArticles: [],
        drafts: []
      };
    }
  }
};
