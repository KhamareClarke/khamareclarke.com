import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import crypto from 'crypto';

// In-memory rate limiter: 5 attempts per IP per 15 minutes.
// Best-effort on serverless (state is per-instance); upgrade to Upstash ratelimit for production.
const attempts = new Map(); // ip -> { count, resetAt }
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
  // Prune old entries periodically to avoid memory leak
  if (attempts.size > 1000) {
    for (const [k, v] of attempts) {
      if (now >= v.resetAt) attempts.delete(k);
    }
  }
  return true;
}

function getAdminPassword() {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) return null;
  return pw;
}

function getToken(password) {
  return crypto.createHmac('sha256', password).update('dashboard').digest('hex');
}

export async function POST(req) {
  try {
    const password = getAdminPassword();
    if (!password) {
      return NextResponse.json({ error: 'auth not configured' }, { status: 500 });
    }

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

    const { password: provided } = await req.json();
    if (provided === password) {
      const cookieStore = await cookies();
      cookieStore.set('admin_session', getToken(password), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 24 * 60 * 60,
      });
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ ok: false }, { status: 401 });
  } catch (e) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
