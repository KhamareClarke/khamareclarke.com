/**
 * POST /api/fleet/ingest
 * Central ingest for cross-project fleet events (leads, orders, forms, status changes).
 *
 * Auth: Authorization: Bearer <FLEET_INGEST_SECRET>
 * Body: { project, event_type, summary, payload? }
 */
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function unauthorized(message = 'Unauthorized') {
  return Response.json({ ok: false, error: message }, { status: 401 });
}

function normaliseEvent(raw) {
  if (!raw || typeof raw !== 'object') return null;
  const project = String(raw.project || '').trim().toLowerCase();
  const eventType = String(raw.event_type || '').trim().toLowerCase();
  const summary = String(raw.summary || '').trim();
  if (!project || !eventType || !summary) return null;
  return {
    project,
    event_type: eventType,
    summary: summary.slice(0, 500),
    payload: raw.payload && typeof raw.payload === 'object' ? raw.payload : {},
  };
}

export async function POST(request) {
  const fleetSecret = process.env.FLEET_INGEST_SECRET;
  const empireSecret = process.env.EMPIRE_INGEST_SECRET;
  if (!fleetSecret && !empireSecret) {
    return Response.json(
      { ok: false, error: 'FLEET_INGEST_SECRET not configured on the hub' },
      { status: 500 }
    );
  }

  const auth = request.headers.get('authorization') || '';
  const provided = auth.toLowerCase().startsWith('bearer ') ? auth.slice(7).trim() : '';
  const authorized =
    provided &&
    ((fleetSecret && provided === fleetSecret) || (empireSecret && provided === empireSecret));
  if (!authorized) return unauthorized();

  if (!supabaseAdmin) {
    return Response.json({ ok: false, error: 'Supabase service role not configured' }, { status: 500 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: 'Invalid JSON' }, { status: 400 });
  }

  const event = normaliseEvent(body);
  if (!event) {
    return Response.json(
      { ok: false, error: 'Body must include project, event_type, and summary' },
      { status: 400 }
    );
  }

  const { data, error } = await supabaseAdmin.from('fleet_events').insert(event).select('id').single();

  if (error) {
    return Response.json({ ok: false, error: error.message }, { status: 500 });
  }

  return Response.json({ ok: true, id: data?.id });
}

export function GET() {
  return Response.json(
    { ok: false, error: 'Use POST with Authorization: Bearer <FLEET_INGEST_SECRET>' },
    { status: 405 }
  );
}
