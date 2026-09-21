/**
 * Resolves static asset paths accounting for Vite base path and GitHub Pages routing.
 * Ensures local development, SQLite uploads, and GitHub Pages deployments all resolve images correctly.
 */
export function getPhotoUrl(photoUrl) {
  if (!photoUrl) return '';
  
  // Data URLs (base64) or absolute HTTP(S) URLs need no manipulation
  if (photoUrl.startsWith('data:') || photoUrl.startsWith('http://') || photoUrl.startsWith('https://') || photoUrl.startsWith('blob:')) {
    return photoUrl;
  }

  // Normalize path by stripping leading ./ or /
  let cleanPath = photoUrl.replace(/^(\.\/|\/)/, '');

  // If the path refers to the old terminal screenshot upload, point to authentic profile photo
  if (cleanPath.includes('profile-1789619013564.png')) {
    cleanPath = 'profile.jpg';
  }

  // Use Vite's configured base URL (/kmsafinkamalPortfolio.github.io/ on gh-pages, / in dev)
  const base = import.meta.env.BASE_URL || '/';
  return base.endsWith('/') ? `${base}${cleanPath}` : `${base}/${cleanPath}`;
}
