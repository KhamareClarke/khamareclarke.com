import { NextResponse } from 'next/server';

async function verifySession(sessionToken) {
  const password = process.env.ADMIN_PASSWORD;
  if (!password || !sessionToken) return false;
  try {
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(password),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode('dashboard'));
    const expected = Array.from(new Uint8Array(sig))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
    return sessionToken === expected;
  } catch {
    return false;
  }
}

export async function middleware(req) {
  const session = req.cookies.get('admin_session')?.value;
  const valid = await verifySession(session);
  if (!valid) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('callbackUrl', req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard', '/dashboard/:path*'],
};
