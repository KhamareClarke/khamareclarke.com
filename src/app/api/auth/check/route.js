import { NextResponse } from 'next/server';
import { getSessionAndProfile } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const { user, profile } = await getSessionAndProfile();
  if (!user) {
    return NextResponse.json({ loggedIn: false });
  }
  return NextResponse.json({
    loggedIn: true,
    role: profile?.role || 'client',
    email: user.email,
    userId: user.id,
    fullName: profile?.full_name || null,
  });
}
