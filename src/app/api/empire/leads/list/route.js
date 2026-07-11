/**
 * GET /api/empire/leads/list?projectId=myapproved
 * Returns leads using service role (same client as the app) so the dashboard sees saved leads.
 */
import { supabaseAdmin } from '@/lib/supabase';
import { requireAuth } from '@/lib/api-guard';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  const authError = await requireAuth();
  if (authError) return authError;

  if (!supabaseAdmin) {
    return Response.json({ ok: false, leads: [], count24h: 0, error: 'Supabase not configured (NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY)' }, { status: 500 });
  }
  const { searchParams } = new URL(req.url);
  const projectId = (searchParams.get('projectId') || 'myapproved').trim().toLowerCase();
  const now = new Date();
  const ts24 = new Date(now - 24 * 60 * 60 * 1000).toISOString();
  try {
    const [leadsRes, count24Res] = await Promise.all([
      supabaseAdmin.from('empire_leads').select('*').eq('project_id', projectId).order('created_at', { ascending: false }).limit(500),
      supabaseAdmin.from('empire_leads').select('id', { count: 'exact', head: true }).eq('project_id', projectId).gte('created_at', ts24),
    ]);
    if (leadsRes.error) {
      return Response.json({ ok: false, leads: [], count24h: 0, error: leadsRes.error.message, code: leadsRes.error.code }, { status: 200 });
    }
    return Response.json({
      ok: true,
      leads: leadsRes.data || [],
      count24h: count24Res.count ?? 0,
    });
  } catch (e) {
    return Response.json({ ok: false, leads: [], count24h: 0, error: e.message }, { status: 500 });
  }
}
