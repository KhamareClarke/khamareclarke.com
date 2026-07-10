'use client';

/**
 * Open an external URL. Tries a new tab first; if the browser blocks popups
 * (common after voice), navigates the current tab so the site actually opens.
 */
export function navigateExternalUrl(url) {
  if (!url || typeof window === 'undefined') return 'failed';
  try {
    const win = window.open(url, '_blank', 'noopener,noreferrer');
    if (win != null) return 'tab';
  } catch {
    // popup blocked — fall through
  }
  try {
    window.location.assign(url);
    return 'same';
  } catch {
    return 'failed';
  }
}
