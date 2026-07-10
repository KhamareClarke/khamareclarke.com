/** Popular site shortcuts for "open youtube" style commands. */
export const POPULAR_SITES = {
  youtube: 'https://www.youtube.com',
  yt: 'https://www.youtube.com',
  google: 'https://www.google.com',
  amazon: 'https://www.amazon.co.uk',
  facebook: 'https://www.facebook.com',
  fb: 'https://www.facebook.com',
  twitter: 'https://twitter.com',
  x: 'https://x.com',
  linkedin: 'https://www.linkedin.com',
  github: 'https://github.com',
  reddit: 'https://www.reddit.com',
  instagram: 'https://www.instagram.com',
  netflix: 'https://www.netflix.com',
  spotify: 'https://open.spotify.com',
  gmail: 'https://mail.google.com',
  maps: 'https://maps.google.com',
};

export function resolveSiteUrl(token) {
  const raw = String(token || '').trim();
  if (!raw) return null;
  let lower = raw.toLowerCase().replace(/[.!?,;:]+$/g, '');
  lower = lower.replace(/^the\s+/, '');
  if (/^https?:\/\//i.test(lower)) return lower;
  if (POPULAR_SITES[lower]) return POPULAR_SITES[lower];
  const first = lower.split(/\s+/)[0]?.replace(/^the\s+/, '') || '';
  if (first && POPULAR_SITES[first]) return POPULAR_SITES[first];
  if (/^[a-z0-9][-a-z0-9]*\.[a-z]{2,}/i.test(lower)) return `https://${lower}`;
  return null;
}
