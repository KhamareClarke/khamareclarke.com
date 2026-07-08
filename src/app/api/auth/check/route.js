import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import crypto from 'crypto';

function getAdminPassword() {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) return null;
  return pw;
}

function getToken(password) {
  return crypto.createHmac('sha256', password).update('dashboard').digest('hex');
}

export async function GET() {
  const password = getAdminPassword();
  if (!password) {
    return NextResponse.json({ loggedIn: false, error: 'auth not configured' }, { status: 500 });
  }
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session')?.value;
  const valid = session === getToken(password);
  return NextResponse.json({ loggedIn: valid });
}
