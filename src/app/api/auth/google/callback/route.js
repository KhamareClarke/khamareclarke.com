import { getSupabaseServer } from '@/lib/supabase-server';
import { exchangeCodeForTokens, storeOAuthTokens } from '@/lib/jarvis/calendar';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || '';

  if (error || !code) {
    return Response.redirect(`${appUrl}/dashboard/jarvis?calendarError=1`, 302);
  }

  try {
    const supabase = await getSupabaseServer();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return Response.redirect(`${appUrl}/login?callbackUrl=/api/auth/google`, 302);
    }

    const tokens = await exchangeCodeForTokens(code);
    if (!tokens.refresh_token) {
      return Response.redirect(`${appUrl}/dashboard/jarvis?calendarError=no-refresh-token`, 302);
    }

    await storeOAuthTokens(user.id, {
      refreshToken: tokens.refresh_token,
      accessToken: tokens.access_token,
      expiresIn: tokens.expires_in,
    });

    return Response.redirect(`${appUrl}/dashboard/jarvis?calendarConnected=1`, 302);
  } catch (err) {
    console.error('[calendar/callback] error:', err.message);
    return Response.redirect(`${appUrl}/dashboard/jarvis?calendarError=1`, 302);
  }
}
