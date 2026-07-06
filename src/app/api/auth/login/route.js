import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import crypto from 'crypto';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

function getToken() {
  return crypto.createHmac('sha256', ADMIN_PASSWORD).update('dashboard').digest('hex');
}

export async function POST(req) {
  try {
    const { password } = await req.json();
    if (password === ADMIN_PASSWORD) {
      const cookieStore = await cookies();
      cookieStore.set('admin_session', getToken(), {
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
