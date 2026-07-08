'use client';

import { useEffect, useState } from 'react';

/**
 * Client-side admin gate for dashboard pages (belt-and-suspenders with middleware).
 * Redirects to /login if not signed in, or /portal if signed in as a client.
 */
export function useAdminGuard() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    fetch('/api/auth/check', { credentials: 'include', cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => {
        if (!d.loggedIn) {
          const callback = encodeURIComponent(window.location.pathname + window.location.search);
          window.location.href = `/login?callbackUrl=${callback}`;
          return;
        }
        if (d.role !== 'admin') {
          window.location.href = '/portal';
          return;
        }
        setReady(true);
      })
      .catch(() => {
        window.location.href = '/login';
      });
  }, []);

  return ready;
}
