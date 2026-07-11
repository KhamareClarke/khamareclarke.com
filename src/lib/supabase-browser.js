/**
 * Browser-side Supabase client (singleton) for Client Components.
 * Manages the auth session in cookies via @supabase/ssr so it stays in sync
 * with the server client and middleware.
 *
 * Usage:
 *   'use client';
 *   import { getSupabaseBrowser } from '@/lib/supabase-browser';
 *   const supabase = getSupabaseBrowser();
 */
import { createBrowserClient } from '@supabase/ssr';

let client = null;

export function getSupabaseBrowser() {
  if (client) return client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) {
    throw new Error('Supabase URL/anon key not configured');
  }
  client = createBrowserClient(url, anon);
  return client;
}
