import { cookies } from 'next/headers';
import crypto from 'crypto';

function getAdminPassword() {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) throw new Error('ADMIN_PASSWORD env var is not set — auth not configured');
  return pw;
}

function getToken(password) {
  return crypto.createHmac('sha256', password).update('dashboard').digest('hex');
}

export async function isAuthenticated() {
  try {
    const password = getAdminPassword();
    const cookieStore = await cookies();
    const session = cookieStore.get('admin_session')?.value;
    return session === getToken(password);
  } catch {
    return false;
  }
}
