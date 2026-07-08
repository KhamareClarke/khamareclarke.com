import { isAuthenticated, isAdmin } from '@/lib/auth';

/**
 * Guard for admin-only API routes (Empire OS, dashboard admin actions).
 * Requires:
 *   1. A valid Supabase session, AND
 *   2. profiles.role = 'admin' for that user.
 *
 * Returns a Response on failure, null on success.
 */
export async function requireAuth() {
  if (!(await isAuthenticated())) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (!(await isAdmin())) {
    return Response.json({ error: 'Forbidden — admin role required' }, { status: 403 });
  }
  return null;
}

/**
 * Guard for authenticated client-portal routes (any signed-in user, admin or client).
 * Returns a Response on failure, null on success.
 */
export async function requireSession() {
  if (!(await isAuthenticated())) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}

/**
 * Use on /api/empire/cron/* routes triggered by Vercel Cron or manually.
 * Accepts Authorization: Bearer <CRON_SECRET>.
 * On Vercel, set CRON_SECRET in env vars — Vercel sends it automatically with each cron request.
 * Falls back to admin session check so the dashboard "Run now" buttons still work.
 * Returns a Response on failure, null on success.
 */
export async function requireCronSecret(req) {
  const secret = process.env.CRON_SECRET;

  // If CRON_SECRET is configured, check bearer token first
  if (secret) {
    const auth = req.headers.get('authorization') || '';
    const provided = auth.toLowerCase().startsWith('bearer ') ? auth.slice(7).trim() : '';
    if (provided === secret) return null;
  }

  // Fall back to admin session (allows "Run now" from the dashboard)
  if (await isAuthenticated()) {
    if (await isAdmin()) return null;
  }

  return Response.json(
    { error: 'Unauthorized — missing CRON_SECRET bearer or admin session' },
    { status: 401 }
  );
}
