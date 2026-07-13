/**
 * Google Calendar connector — server-side only.
 * Env: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, NEXT_PUBLIC_APP_URL
 * Refresh tokens are persisted in Supabase profiles.google_refresh_token.
 * Access tokens are cached in-process with a 55-minute validity buffer.
 */

const TOKEN_ENDPOINT = 'https://oauth2.googleapis.com/token';
const CALENDAR_BASE = 'https://www.googleapis.com/calendar/v3';
const BUFFER_MS = 55 * 60 * 1000;

// { userId -> { accessToken: string, expiresAt: number } }
const tokenCache = new Map();

export function getOAuthConsentUrl() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!clientId || !appUrl) throw new Error('GOOGLE_CLIENT_ID or NEXT_PUBLIC_APP_URL not set');
  const url = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  url.searchParams.set('client_id', clientId);
  url.searchParams.set('redirect_uri', `${appUrl}/api/auth/google/callback`);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('scope', 'https://www.googleapis.com/auth/calendar.readonly');
  url.searchParams.set('access_type', 'offline');
  url.searchParams.set('prompt', 'consent');
  return url.toString();
}

export async function exchangeCodeForTokens(code) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!clientId || !clientSecret || !appUrl) {
    throw new Error('Google OAuth env vars not configured');
  }
  const res = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: `${appUrl}/api/auth/google/callback`,
      grant_type: 'authorization_code',
    }),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`Token exchange failed: HTTP ${res.status}`);
  return res.json();
}

export async function storeOAuthTokens(userId, { refreshToken, accessToken, expiresIn }) {
  const { supabaseAdmin } = await import('@/lib/supabase');
  if (!supabaseAdmin) throw new Error('supabaseAdmin not available — check SUPABASE_SERVICE_ROLE_KEY');
  const { error } = await supabaseAdmin
    .from('profiles')
    .update({ google_refresh_token: refreshToken })
    .eq('id', userId);
  if (error) throw new Error(`Failed to store refresh token: ${error.message}`);
  if (accessToken && expiresIn) {
    tokenCache.set(userId, { accessToken, expiresAt: Date.now() + expiresIn * 1000 });
  }
}

async function refreshAccessToken(refreshToken) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) throw new Error('Google OAuth env vars not configured');
  const res = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`Token refresh failed: HTTP ${res.status}`);
  return res.json();
}

/**
 * Returns a valid access token for userId, refreshing via stored refresh token if needed.
 * Returns null if the user has not connected Google Calendar.
 */
export async function getValidAccessToken(userId) {
  const cached = tokenCache.get(userId);
  if (cached && cached.expiresAt - Date.now() > BUFFER_MS) {
    return cached.accessToken;
  }

  const { supabaseAdmin } = await import('@/lib/supabase');
  if (!supabaseAdmin) return null;

  const { data: profile, error } = await supabaseAdmin
    .from('profiles')
    .select('google_refresh_token')
    .eq('id', userId)
    .maybeSingle();

  if (error || !profile?.google_refresh_token) return null;

  try {
    const tokens = await refreshAccessToken(profile.google_refresh_token);
    const { access_token: accessToken, expires_in: expiresIn = 3600 } = tokens;
    tokenCache.set(userId, { accessToken, expiresAt: Date.now() + expiresIn * 1000 });
    return accessToken;
  } catch (err) {
    console.error('[calendar] token refresh error:', err.message);
    return null;
  }
}

/**
 * Returns an array of upcoming events, null if not connected, or [] on API error.
 * Caller must supply a valid userId (from Supabase session).
 */
export async function getUpcomingEvents(userId, { maxResults = 10, timeMin, timeMax } = {}) {
  const accessToken = await getValidAccessToken(userId);
  if (accessToken === null) return null;

  try {
    const url = new URL(`${CALENDAR_BASE}/calendars/primary/events`);
    url.searchParams.set('maxResults', String(maxResults));
    url.searchParams.set('singleEvents', 'true');
    url.searchParams.set('orderBy', 'startTime');
    url.searchParams.set('timeMin', timeMin ?? new Date().toISOString());
    if (timeMax) url.searchParams.set('timeMax', timeMax);

    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${accessToken}`, Accept: 'application/json' },
      cache: 'no-store',
    });

    if (res.status === 401) {
      tokenCache.delete(userId);
      return null;
    }
    if (res.status === 429) {
      console.error('[calendar] rate limit hit (429)');
      return [];
    }
    if (!res.ok) {
      console.error(`[calendar] HTTP ${res.status}`);
      return [];
    }

    const data = await res.json();
    return (data.items ?? []).map(({ id, summary, description, start, end, location, htmlLink }) => ({
      id,
      summary: summary ?? '(No title)',
      description: description ?? null,
      start: start?.dateTime ?? start?.date ?? null,
      end: end?.dateTime ?? end?.date ?? null,
      location: location ?? null,
      link: htmlLink ?? null,
    }));
  } catch (err) {
    console.error('[calendar] getUpcomingEvents error:', err.message);
    return [];
  }
}
