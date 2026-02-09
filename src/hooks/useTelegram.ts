import { useEffect, useCallback } from 'react';

export const useTelegram = () => {
  const trackVisit = useCallback(() => {
    try {
      // Use no-cors to avoid CORS issues on static hosts if API is on a different domain (though relative path is preferred)
      // Using /api/v1/monitor relative path assumes same domain or proxy
      // Silently catch errors to avoid console noise on static deployments
      fetch('/api/v1/monitor?page=' + encodeURIComponent(window.location.pathname))
        .catch(() => {}); // Silent catch
    } catch (e) {
      // Ignore errors
    }
  }, []);

  const sendAlert = useCallback((alertType: string, message: string, count?: number) => {
    try {
      fetch('/api/v1/monitor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'alert',
          alertType,
          detail: message,
          count
        })
      }).catch(() => {}); // Silent catch
    } catch (e) {
      // Ignore errors
    }
  }, []);

  // Auto-track heartbeat on mount? 
  // The user asked for heartbeat every 5 min.
  // We can do it here.
  useEffect(() => {
    const interval = setInterval(() => {
      try {
        fetch('/api/v1/monitor?type=heartbeat')
          .catch(() => {});
      } catch (e) {}
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, []);

  return { trackVisit, sendAlert };
};
