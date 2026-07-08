import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/api-guard';
import { supabaseAdmin } from '@/lib/supabase';

const ALLOWED_STATUSES = ['active', 'paused', 'completed'];

/**
 * POST /api/admin/projects
 * Body: { client_id, project_name, tier?, ghl_contact_id?, notes?, status? }
 * Creates a client_projects row. Admin-only.
 */
export async function POST(req) {
  const guard = await requireAuth();
  if (guard) return guard;

  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Service role not configured' }, { status: 503 });
    }
    const body = await req.json().catch(() => ({}));
    const clientId = String(body.client_id || '').trim();
    const projectName = String(body.project_name || '').trim();
    if (!clientId || !projectName) {
      return NextResponse.json({ error: 'client_id and project_name required' }, { status: 400 });
    }
    const status = ALLOWED_STATUSES.includes(body.status) ? body.status : 'active';

    const { data, error } = await supabaseAdmin
      .from('client_projects')
      .insert({
        client_id: clientId,
        project_name: projectName.slice(0, 200),
        tier: body.tier ? String(body.tier).slice(0, 60) : null,
        ghl_contact_id: body.ghl_contact_id ? String(body.ghl_contact_id).slice(0, 100) : null,
        notes: body.notes ? String(body.notes).slice(0, 4000) : null,
        status,
      })
      .select()
      .single();
    if (error) throw error;

    return NextResponse.json({ ok: true, project: data });
  } catch (err) {
    console.error('Project create error:', err);
    return NextResponse.json({ error: err.message || 'Failed' }, { status: 500 });
  }
}

/**
 * PATCH /api/admin/projects
 * Body: { id, status?, tier?, ghl_contact_id?, notes?, project_name? }
 */
export async function PATCH(req) {
  const guard = await requireAuth();
  if (guard) return guard;

  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Service role not configured' }, { status: 503 });
    }
    const body = await req.json().catch(() => ({}));
    const id = String(body.id || '').trim();
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

    const patch = { updated_at: new Date().toISOString() };
    if (body.status !== undefined) {
      if (!ALLOWED_STATUSES.includes(body.status)) {
        return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
      }
      patch.status = body.status;
    }
    if (body.tier !== undefined) patch.tier = body.tier || null;
    if (body.ghl_contact_id !== undefined) patch.ghl_contact_id = body.ghl_contact_id || null;
    if (body.notes !== undefined) patch.notes = body.notes || null;
    if (body.project_name !== undefined) patch.project_name = String(body.project_name).slice(0, 200);

    const { data, error } = await supabaseAdmin
      .from('client_projects')
      .update(patch)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;

    return NextResponse.json({ ok: true, project: data });
  } catch (err) {
    console.error('Project update error:', err);
    return NextResponse.json({ error: err.message || 'Failed' }, { status: 500 });
  }
}
