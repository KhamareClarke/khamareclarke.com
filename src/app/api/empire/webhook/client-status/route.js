import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

const ALLOWED_STATUSES = ['active', 'paused', 'completed'];

function getSecret(req) {
  const auth = req.headers.get('authorization') || '';
  if (auth.toLowerCase().startsWith('bearer ')) return auth.slice(7).trim();
  return req.headers.get('x-empire-key') || req.headers.get('x-webhook-secret') || '';
}

/**
 * POST /api/empire/webhook/client-status
 * Bearer auth: EMPIRE_WEBHOOK_SECRET (same env var as the existing empire trigger webhook).
 * Body: { client_id, project_id, status_update: string, new_status?: 'active'|'paused'|'completed' }
 *
 * Appends the status_update to client_projects.notes (prepending timestamp),
 * optionally updates client_projects.status, and writes an entry to empire_supervisor_log
 * so the update is visible in the /dashboard/empire supervisor feed.
 *
 * Intended caller: ZeroClaw agent (invoked via WhatsApp), or any external
 * automation that maintains client project state.
 */
export async function POST(req) {
  try {
    const secret = process.env.EMPIRE_WEBHOOK_SECRET || process.env.EMPIRE_TRIGGER_SECRET;
    if (!secret) {
      return NextResponse.json(
        { error: 'Webhook not configured (set EMPIRE_WEBHOOK_SECRET)' },
        { status: 503 }
      );
    }
    if (getSecret(req) !== secret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }

    const body = await req.json().catch(() => ({}));
    const clientId = String(body.client_id || '').trim();
    const projectId = String(body.project_id || '').trim();
    const statusUpdate = String(body.status_update || '').trim();
    const newStatus = body.new_status ? String(body.new_status).trim() : null;

    if (!clientId || !projectId) {
      return NextResponse.json(
        { error: 'client_id and project_id required' },
        { status: 400 }
      );
    }
    if (!statusUpdate) {
      return NextResponse.json({ error: 'status_update required' }, { status: 400 });
    }
    if (newStatus && !ALLOWED_STATUSES.includes(newStatus)) {
      return NextResponse.json(
        { error: `new_status must be one of ${ALLOWED_STATUSES.join(', ')}` },
        { status: 400 }
      );
    }

    // Verify project belongs to client.
    const { data: project, error: pErr } = await supabaseAdmin
      .from('client_projects')
      .select('id, client_id, notes, status, project_name')
      .eq('id', projectId)
      .maybeSingle();
    if (pErr) throw pErr;
    if (!project) return NextResponse.json({ error: 'project not found' }, { status: 404 });
    if (project.client_id !== clientId) {
      return NextResponse.json({ error: 'project does not belong to client' }, { status: 403 });
    }

    // Prepend the new note (dated).
    const now = new Date();
    const stamped = `[${now.toISOString()}] ${statusUpdate}`;
    const nextNotes = project.notes ? `${stamped}\n\n${project.notes}` : stamped;

    const patch = { notes: nextNotes.slice(0, 8000), updated_at: now.toISOString() };
    if (newStatus) patch.status = newStatus;

    const { error: uErr } = await supabaseAdmin
      .from('client_projects')
      .update(patch)
      .eq('id', projectId);
    if (uErr) throw uErr;

    // Log to supervisor feed (best-effort; ignore failures).
    try {
      await supabaseAdmin.from('empire_supervisor_log').insert({
        message: `Client status update on ${project.project_name}: ${statusUpdate.slice(0, 400)}`,
        project_id: 'khamareclarke',
        team_id: 'client-portal',
        task_type: 'client-status-webhook',
      });
    } catch {}

    return NextResponse.json({
      ok: true,
      projectId,
      status: patch.status || project.status,
    });
  } catch (err) {
    console.error('Client-status webhook error:', err);
    return NextResponse.json({ error: err.message || 'Failed' }, { status: 500 });
  }
}
