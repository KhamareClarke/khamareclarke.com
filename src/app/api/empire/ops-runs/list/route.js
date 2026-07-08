/**
 * GET /api/empire/ops-runs/list?projectId=myapproved
 * Returns Ops (bugs & links) runs from DB (like leads list) for dashboard.
 */
import { createClient } from '@supabase/supabase-js';
import { supabaseAdmin } from '@/lib/supabase';
import { requireAuth } from '@/lib/api-guard';

export const dynamic = 'force-dynamic';

function getClient() {
  if (supabaseAdmin) return supabaseAdmin;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (url && key) return createClient(url, key, { auth: { persistSession: false } });
  return null;
}

export async function GET(req) {
  const authError = await requireAuth();
  if (authError) return authError;

  const client = getClient();
  if (!client) {
    return Response.json({ ok: false, runs: [], count24h: 0, error: 'Supabase not configured' }, { status: 200 });
  }
  const { searchParams } = new URL(req.url || '', 'http://localhost');
  const projectId = (searchParams.get('projectId') || 'myapproved').trim().toLowerCase();
  const limit = Math.min(parseInt(searchParams.get('limit'), 10) || 100, 500);
  const now = new Date();
  const ts24 = new Date(now - 24 * 60 * 60 * 1000).toISOString();
  try {
    const [runsRes, count24Res] = await Promise.all([
      client.from('empire_ops_runs').select('*').eq('project_id', projectId).order('created_at', { ascending: false }).limit(limit),
      client.from('empire_ops_runs').select('id', { count: 'exact', head: true }).eq('project_id', projectId).gte('created_at', ts24),
    ]);
    if (runsRes.error) {
      return Response.json({ ok: false, runs: [], count24h: 0, error: runsRes.error.message }, { status: 200 });
    }
    return Response.json({
      ok: true,
      runs: runsRes.data || [],
      count24h: count24Res.count ?? 0,
    });
  } catch (e) {
    return Response.json({ ok: false, runs: [], count24h: 0, error: e?.message || 'Failed' }, { status: 200 });
  }
}
