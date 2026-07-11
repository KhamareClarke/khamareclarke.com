/**
 * GET /api/empire/fleet-status — live status of all projects (from empire_project_analysis).
 * Poll this while "Analyze all" is running to show live updates.
 */
import { createClient } from '@supabase/supabase-js';
import { requireAuth } from '@/lib/api-guard';

export const dynamic = 'force-dynamic';

const DASHBOARD_PROJECT_IDS = [
  'myapproved', 'khamareclarke', 'omniwtms', 'leverageacademy', 'fliprepublic',
  'leveragejournal', 'inboker', 'identitymarketing', 'adstarter', 'seoinforce', 'alkemmy',
];

export async function GET() {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseKey) {
      return Response.json({ error: 'Supabase not configured' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } });
    const { data: rows } = await supabase
      .from('empire_project_analysis')
      .select('project_id, summary, status, error_message, updated_at')
      .in('project_id', DASHBOARD_PROJECT_IDS);

    const byProject = (rows || []).reduce((acc, r) => { acc[r.project_id] = r; return acc; }, {});
    const list = DASHBOARD_PROJECT_IDS.map((project_id) => ({
      project_id,
      ...(byProject[project_id] || { summary: null, status: 'pending', error_message: null, updated_at: null }),
    }));

    return Response.json({ projects: list });
  } catch (err) {
    return Response.json({ error: err?.message || 'Failed to fetch fleet status' }, { status: 500 });
  }
}
