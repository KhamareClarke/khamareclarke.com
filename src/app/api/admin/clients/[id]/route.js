import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/api-guard';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * GET /api/admin/clients/[id]
 * Returns a single client with profile, email, projects, documents,
 * and full onboarding history. Admin-only.
 */
export async function GET(_req, { params }) {
  const guard = await requireAuth();
  if (guard) return guard;

  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Service role not configured' }, { status: 503 });
    }

    const { id } = await params;
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

    const { data: profile, error: pErr } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (pErr) throw pErr;
    if (!profile) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    let email = null;
    try {
      const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(id);
      email = authUser?.user?.email || null;
    } catch {}

    const [{ data: projects = [] }, { data: documents = [] }, { data: onboarding = [] }] = await Promise.all([
      supabaseAdmin
        .from('client_projects')
        .select('*')
        .eq('client_id', id)
        .order('created_at', { ascending: false }),
      supabaseAdmin
        .from('documents')
        .select('*')
        .eq('client_id', id)
        .order('uploaded_at', { ascending: false }),
      supabaseAdmin
        .from('onboarding_clients')
        .select('*')
        .eq('user_id', id)
        .order('created_at', { ascending: false }),
    ]);

    return NextResponse.json({
      client: { ...profile, email },
      projects: projects || [],
      documents: documents || [],
      onboarding: onboarding || [],
    });
  } catch (err) {
    console.error('Admin client detail error:', err);
    return NextResponse.json({ error: err.message || 'Failed' }, { status: 500 });
  }
}
