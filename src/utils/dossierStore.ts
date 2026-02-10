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

export const saveDossier = (entry: Omit<DossierEntry, 'id' | 'timestamp'>) => {
  try {
    const history = getDossiers();
    
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

export const getDossiers = (): DossierEntry[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Failed to load dossiers:', e);
    return [];
  }
};

export const clearDossiers = () => {
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event('dossier-updated'));
};
