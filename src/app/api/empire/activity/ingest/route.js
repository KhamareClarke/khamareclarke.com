/**
 * POST /api/empire/activity/ingest
 * Receives end-user events (signin, signup, verify, audit, payment, error)
 * from sister projects (Seoinforce, myApproved, Leverage Journal, ...).
 *
 * Auth: Authorization: Bearer <EMPIRE_INGEST_SECRET>
 * Body: { project_id, event_type, status?, user_email?, user_id?, user_name?,
 *         source?, message?, metadata?, ip?, user_agent? }
 * Or:   { events: [ ... ] }  (batch)
 *
 * Writes to empire_user_activity using the service role key.
 */
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const ALLOWED_EVENTS = new Set([
  'signin',
  'signin_failed',
  'signup',
  'signup_failed',
  'verify_email',
  'password_reset_request',
  'password_reset_complete',
  'project_created',
  'audit_started',
  'audit_completed',
  'audit_failed',
  'payment_succeeded',
  'payment_failed',
  'subscription_created',
  'subscription_cancelled',
  'lead_created',
  'logout',
  'custom',
]);

function unauthorized(message = 'Unauthorized') {
  return Response.json({ ok: false, error: message }, { status: 401 });
}

function clientIp(request) {
  const xf = request.headers.get('x-forwarded-for');
  if (xf) return xf.split(',')[0].trim();
  return request.headers.get('x-real-ip') || null;
}

function normaliseEvent(raw, fallbackIp, fallbackUa) {
  if (!raw || typeof raw !== 'object') return null;
  const projectId = String(raw.project_id || '').trim().toLowerCase();
  const eventType = String(raw.event_type || '').trim().toLowerCase();
  if (!projectId || !eventType) return null;
  if (!ALLOWED_EVENTS.has(eventType)) return null;

  const status = ['ok', 'failed', 'pending'].includes(raw.status) ? raw.status : 'ok';
  return {
    project_id: projectId,
    event_type: eventType,
    status,
    user_email: raw.user_email ? String(raw.user_email).toLowerCase().slice(0, 320) : null,
    user_id: raw.user_id ? String(raw.user_id).slice(0, 128) : null,
    user_name: raw.user_name ? String(raw.user_name).slice(0, 200) : null,
    source: raw.source ? String(raw.source).slice(0, 64) : null,
    message: raw.message ? String(raw.message).slice(0, 1000) : null,
    ip: (raw.ip ? String(raw.ip).slice(0, 64) : null) || fallbackIp,
    user_agent: (raw.user_agent ? String(raw.user_agent).slice(0, 500) : null) || fallbackUa,
    metadata: raw.metadata && typeof raw.metadata === 'object' ? raw.metadata : {},
  };
}

export async function POST(request) {
  const secret = process.env.EMPIRE_INGEST_SECRET;
  if (!secret) {
    return Response.json(
      { ok: false, error: 'EMPIRE_INGEST_SECRET not configured on the Empire hub' },
      { status: 500 }
    );
  }

  const auth = request.headers.get('authorization') || '';
  const provided = auth.toLowerCase().startsWith('bearer ') ? auth.slice(7).trim() : '';
  if (!provided || provided !== secret) return unauthorized();

  if (!supabaseAdmin) {
    return Response.json({ ok: false, error: 'Supabase service role not configured' }, { status: 500 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: 'Invalid JSON' }, { status: 400 });
  }

  const fallbackIp = clientIp(request);
  const fallbackUa = request.headers.get('user-agent') || null;

  const rawEvents = Array.isArray(body?.events) ? body.events : [body];
  const events = rawEvents
    .map((e) => normaliseEvent(e, fallbackIp, fallbackUa))
    .filter(Boolean);

  if (events.length === 0) {
    return Response.json({ ok: false, error: 'No valid events in payload' }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from('empire_user_activity')
    .insert(events)
    .select('id');

  if (error) {
    return Response.json({ ok: false, error: error.message }, { status: 500 });
  }

  return Response.json({ ok: true, inserted: data?.length ?? 0 });
}

export function GET() {
  return Response.json(
    { ok: false, error: 'Use POST with Authorization: Bearer <EMPIRE_INGEST_SECRET>' },
    { status: 405 }
  );
}
