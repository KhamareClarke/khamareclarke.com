'use client';

/**
 * Open a URL in a new tab only — never navigates away from JARVIS.
 * Uses about:blank first so blocked popups return null instead of hijacking this tab.
 */
export function navigateExternalUrl(url) {
  if (!url || typeof window === 'undefined') return false;

  try {
    const blank = window.open('about:blank', '_blank', 'noopener,noreferrer');
    if (blank) {
      blank.opener = null;
      blank.location.href = url;
      return true;
    }
  } catch {
    // fall through
  }

  try {
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    anchor.referrerPolicy = 'no-referrer';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    return true;
  } catch {
    return false;
  }
}

/** Absolute URL for an in-app path, opened in a new tab. */
export function openAppRouteInNewTab(route) {
  if (typeof window === 'undefined') return false;
  const path = String(route || '').startsWith('/') ? route : `/${route || ''}`;
  return navigateExternalUrl(`${window.location.origin}${path}`);
}
