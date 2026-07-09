import { NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase-server';

/**
 * Email + password login via Supabase Auth.
 * Body: { email, password }
 * On success, Supabase sets sb-* cookies (session managed by @supabase/ssr).
 *
 * The old ADMIN_PASSWORD flow is gone. Users are provisioned by admin invite
 * (see /api/admin/invite) or by Supabase magic-link/invite email.
 */
// In-memory rate limiter: 5 attempts per IP per 15 minutes.
const attempts = new Map();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;

function checkRateLimit(ip) {
  const now = Date.now();
  const entry = attempts.get(ip);
  if (entry && now < entry.resetAt) {
    if (entry.count >= MAX_ATTEMPTS) return false;
    entry.count += 1;
    return true;
  }
  attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
  if (attempts.size > 1000) {
    for (const [k, v] of attempts) {
      if (now >= v.resetAt) attempts.delete(k);
    }
  }
  return true;
}

export async function POST(req) {
  try {
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      req.headers.get('x-real-ip') ||
      'unknown';

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { ok: false, error: 'Too many attempts. Try again in 15 minutes.' },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const email = String(body.email || '').trim().toLowerCase();
    const password = String(body.password || '');
    const intendedRole = body.intendedRole === 'admin' ? 'admin' : 'client';
    if (!email || !password) {
      return NextResponse.json({ ok: false, error: 'Email and password required' }, { status: 400 });
    }

    const supabase = await getSupabaseServer();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error || !data?.user) {
      return NextResponse.json({ ok: false, error: 'Invalid credentials' }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .maybeSingle();

    const role = profile?.role || 'client';

    if (intendedRole === 'admin' && role !== 'admin') {
      await supabase.auth.signOut();
      return NextResponse.json(
        { ok: false, error: 'This account is not an admin. Switch to Client sign in.' },
        { status: 403 }
      );
    }

    if (intendedRole === 'client' && role === 'admin') {
      await supabase.auth.signOut();
      return NextResponse.json(
        { ok: false, error: 'Use Admin sign in for the control centre account.' },
        { status: 403 }
      );
    }

    return NextResponse.json({ ok: true, role });
  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json({ ok: false, error: 'Login failed' }, { status: 500 });
  }
}
