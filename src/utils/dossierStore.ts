import { supabase } from '../services/reconDb';

export interface DossierEntry {
  id: string;
  number: string;
  isPrime: boolean;
  timestamp: number;
  factors?: string[];
  executionTime: number;
  aiInsight: {
    message: string;
    explanation?: string;
    formula?: string;
    report?: string[];
    fullArticle?: import('./articleGenerator').SEOArticle; // Add full article structure
  };
}

const STORAGE_KEY = 'primos_dossier_history';

export const saveDossier = async (entry: Omit<DossierEntry, 'id' | 'timestamp'>) => {
  try {
    // 1. Save to Supabase (Real-Time DB)
    if (supabase) {
      const { data, error } = await supabase
        .from('dossier_entries')
        .insert([{
          number: entry.number,
          is_prime: entry.isPrime,
          factors: entry.factors,
          ai_insight: entry.aiInsight,
          execution_time: entry.executionTime,
          timestamp: Date.now()
        }])
        .select()
        .single();

      if (error) {
        console.error('Supabase Save Error:', error);
      } else if (data) {
        // Dispatch event for real-time updates
        window.dispatchEvent(new Event('dossier-updated'));
        return {
           ...entry,
           id: data.id,
           timestamp: data.timestamp
        };
      }
    }

    // 2. Fallback: Save to Local Storage (if Supabase fails or not configured)
    console.warn('Supabase not available, saving locally...');
    const history = getLocalDossiers();
    
    // Check if already exists to avoid duplicates at the top
    const existingIndex = history.findIndex(h => h.number === entry.number);
    if (existingIndex !== -1) {
        history.splice(existingIndex, 1); // Remove existing to re-add at top
    }

    const newEntry: DossierEntry = {
      ...entry,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    };

    const newHistory = [newEntry, ...history].slice(0, 50); // Keep last 50
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
    
    // Dispatch event for real-time updates across components
    window.dispatchEvent(new Event('dossier-updated'));
    
    return newEntry;
  } catch (e) {
    console.error('Failed to save dossier:', e);
    return null;
  }
};

export const fetchDossiers = async (): Promise<DossierEntry[]> => {
  try {
    // 1. Try Supabase
    if (supabase) {
      const { data, error } = await supabase
        .from('dossier_entries')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
        
      if (data && !error) {
        // Map DB fields to Frontend Interface
        return data.map(row => ({
          id: row.id,
          number: row.number,
          isPrime: row.is_prime,
          timestamp: row.timestamp,
          factors: row.factors,
          executionTime: row.execution_time,
          aiInsight: row.ai_insight
        }));
      }
    }
  } catch (err) {
    console.error('Supabase Fetch Error:', err);
  }

  // 2. Fallback to Local Storage
  return getLocalDossiers();
};

export const getLocalDossiers = (): DossierEntry[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Failed to load dossiers:', e);
    return [];
  }
};

// Legacy support (sync) - deprecated
export const getDossiers = getLocalDossiers; 

export const clearDossiers = () => {
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event('dossier-updated'));
};
