/**
 * Auth helpers backed by Supabase Auth (replaces the old ADMIN_PASSWORD HMAC cookie).
 *
 * - isAuthenticated(): true when there is a valid Supabase session (any role).
 * - isAdmin(): true when the logged-in user has profiles.role = 'admin'.
 * - getAuthUser(): returns { user, profile } or nulls.
 *
 * Middleware (middleware.js) is the primary gate; these helpers are for
 * Server Components / Route Handlers that need to double-check on the server.
 */
import { getSupabaseServer, getSessionAndProfile } from '@/lib/supabase-server';

export async function isAuthenticated() {
  try {
    const supabase = await getSupabaseServer();
    const { data: { user }, error } = await supabase.auth.getUser();
    return !!user && !error;
  } catch {
    return false;
  }
}

export async function isAdmin() {
  const { profile } = await getSessionAndProfile();
  return profile?.role === 'admin';
}

export async function getAuthUser() {
  return getSessionAndProfile();
}
