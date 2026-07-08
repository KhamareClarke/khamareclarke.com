import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/api-guard';
import { getClientGHLData } from '@/lib/ghl';

/**
 * GET /api/admin/ghl?contactId=<id>
 * Admin-only. Returns cached GHL contact/opportunities/appointments,
 * or 204 if GHL_API_KEY is not configured.
 */
export async function GET(req) {
  const guard = await requireAuth();
  if (guard) return guard;

  const url = new URL(req.url);
  const contactId = url.searchParams.get('contactId');
  if (!contactId) return NextResponse.json({ error: 'contactId required' }, { status: 400 });

  const data = await getClientGHLData(contactId);
  if (!data) return new NextResponse(null, { status: 204 });
  return NextResponse.json(data);
}
