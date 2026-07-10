'use client';

/** Try to open a URL in a new tab; returns whether a tab likely opened. */
export function openExternalUrl(url) {
  if (!url || typeof window === 'undefined') return false;
  try {
    const win = window.open(url, '_blank', 'noopener,noreferrer');
    if (win) return true;
  } catch {
    // fall through
  }
  try {
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    anchor.style.display = 'none';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    return true;
  } catch {
    return false;
  }
}
