/**
 * Server-side Supabase client for Server Components, Route Handlers, and Server Actions.
 * Reads/writes the sb-* auth cookies via next/headers so RLS uses the logged-in user's uid.
 *
 * Usage:
 *   import { getSupabaseServer } from '@/lib/supabase-server';
 *   const supabase = await getSupabaseServer();
 *   const { data: { user } } = await supabase.auth.getUser();
 */
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

export async function getSupabaseServer() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) {
    throw new Error('Supabase URL/anon key not configured');
  }

  const cookieStore = await cookies();

  return createServerClient(url, anon, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Components cannot set cookies — silently ignore. Middleware handles refresh.
        }
      },
    },
  });
}

/** Fetch the current auth user + their profile (or nulls if signed out). */
export async function getSessionAndProfile() {
  try {
    const supabase = await getSupabaseServer();
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) return { user: null, profile: null, supabase };
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, role, full_name, company, created_at')
      .eq('id', user.id)
      .maybeSingle();
    return { user, profile, supabase };
  } catch {
    return { user: null, profile: null, supabase: null };
  }
}
