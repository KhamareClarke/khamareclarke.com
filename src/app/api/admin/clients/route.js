import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/api-guard';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/clients
 * Returns all client profiles with:
 *  - auth email (joined via admin API)
 *  - project count (client_projects)
 *  - latest onboarding submission
 *
 * Admin-only. Uses supabaseAdmin (service role) so RLS join concerns don't apply.
 */
export async function GET() {
  const guard = await requireAuth();
  if (guard) return guard;

  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Service role not configured' }, { status: 503 });
    }

    // 1. All client profiles.
    const { data: profiles, error: pErr } = await supabaseAdmin
      .from('profiles')
      .select('id, full_name, company, role, created_at')
      .eq('role', 'client')
      .order('created_at', { ascending: false });
    if (pErr) throw pErr;

    // 2. Emails via admin auth API (paginate up to 1000 users).
    let emailMap = {};
    try {
      const { data: authList } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1000 });
      for (const u of authList?.users || []) {
        emailMap[u.id] = u.email;
      }
    } catch {
      // ignore — leave emails empty
    }

    const clientIds = (profiles || []).map((p) => p.id);
    if (clientIds.length === 0) {
      return NextResponse.json({ clients: [] });
    }

    // 3. Project counts.
    const { data: projects } = await supabaseAdmin
      .from('client_projects')
      .select('client_id, id, status')
      .in('client_id', clientIds);
    const projectCount = {};
    for (const p of projects || []) {
      projectCount[p.client_id] = (projectCount[p.client_id] || 0) + 1;
    }

    // 4. Latest onboarding row per client.
    const { data: onboardingRows } = await supabaseAdmin
      .from('onboarding_clients')
      .select('user_id, contact_name, email, company_name, goals, created_at')
      .in('user_id', clientIds)
      .order('created_at', { ascending: false });
    const latestOnboarding = {};
    for (const row of onboardingRows || []) {
      if (!row.user_id) continue;
      if (!latestOnboarding[row.user_id]) latestOnboarding[row.user_id] = row;
    }

    const clients = (profiles || []).map((p) => ({
      id: p.id,
      full_name: p.full_name,
      company: p.company,
      email: emailMap[p.id] || null,
      created_at: p.created_at,
      project_count: projectCount[p.id] || 0,
      latest_onboarding: latestOnboarding[p.id] || null,
    }));

    return NextResponse.json({ clients });
  } catch (err) {
    console.error('Admin clients fetch error:', err);
    return NextResponse.json({ error: err.message || 'Failed' }, { status: 500 });
  }
}
