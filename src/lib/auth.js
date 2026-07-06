import { cookies } from 'next/headers';
import crypto from 'crypto';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

function getToken() {
  return crypto.createHmac('sha256', ADMIN_PASSWORD).update('dashboard').digest('hex');
}

export async function isAuthenticated() {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session')?.value;
  return session === getToken();
}
