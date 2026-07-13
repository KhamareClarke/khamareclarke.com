import { requireAuth } from '@/lib/api-guard';
import { getOAuthConsentUrl } from '@/lib/jarvis/calendar';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    const url = getOAuthConsentUrl();
    return Response.redirect(url, 302);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
