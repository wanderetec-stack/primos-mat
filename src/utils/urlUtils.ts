export const safeGetPathname = (url: string): string => {
  if (!url) return '/';
  try {
    return new URL(url).pathname;
  } catch {
    // If it fails, check if it looks like a path
    if (url.startsWith('/')) return url;
    // Fallback to home or 404
    return '/';
  }
};
