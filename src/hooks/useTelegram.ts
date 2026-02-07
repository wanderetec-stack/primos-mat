import { useRef } from 'react';

export const useTelegram = () => {
  const hasTracked = useRef(false);

  const trackVisit = async () => {
    // Prevent double firing in React Strict Mode
    if (hasTracked.current) return;
    
    // Optional: Skip localhost to avoid spam during dev
    // if (window.location.hostname === 'localhost') return;

    try {
      hasTracked.current = true;
      const res = await fetch('/api/visit');
      if (!res.ok) {
        // If 404, we are likely on GitHub Pages (Static) where /api doesn't exist
        // Silently fail or log for debug
        console.debug('Monitor: API endpoint not available (Static Mode)');
      }
    } catch (error) {
      console.debug('Monitor: Network error or offline');
    }
  };

  const sendAlert = async (type: string, details: string, count: number) => {
    try {
      await fetch('/api/alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, details, count })
      });
    } catch (error) {
      console.error('Monitor: Alert failed');
    }
  };

  return { trackVisit, sendAlert };
};
