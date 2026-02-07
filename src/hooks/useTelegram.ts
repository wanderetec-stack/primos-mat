import { useEffect } from 'react';

export const useTelegram = () => {
  useEffect(() => {
    // Send Heartbeat on mount (Session Start)
    // We use fetch to call our Vercel Serverless Function to hide logic/tokens if needed (though tokens are in API code)
    // Using no-cors to avoid blocking, though API supports CORS.
    try {
      fetch('/api/v1/visit?page=' + window.location.pathname)
        .catch(err => console.error('Heartbeat skipped', err));
    } catch (e) {
      // Ignore errors
    }
  }, []);

  return {};
};
