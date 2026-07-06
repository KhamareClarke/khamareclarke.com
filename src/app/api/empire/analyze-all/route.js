/**
 * POST /api/empire/analyze-all — run OpenRouter analysis on all 11 projects. Updates empire_project_analysis
 * after each project so the dashboard can show live progress. Uses ai-seo agent with a full analysis prompt.
 */
import { createClient } from '@supabase/supabase-js';
import { runTaskWithZeroClaw } from '@/lib/empire-run-zeroclaw';
import { getProjectLabel, getProjectRootUrl } from '@/lib/empire-projects';

export const dynamic = 'force-dynamic';
export const maxDuration = 300;

const DASHBOARD_PROJECT_IDS = [
  'myapproved', 'khamareclarke', 'omniwtms', 'leverageacademy', 'fliprepublic',
  'leveragejournal', 'inboker', 'identitymarketing', 'adstarter', 'seoinforce', 'alkemmy',
];

const FLEET_ANALYSIS_TASK = `Fully analyze this project for the Empire fleet dashboard. Consider:
1. Site health and accessibility (if you can infer from the URL/name)
2. SEO and discoverability
3. Marketing and conversion readiness
4. One clear priority improvement
Reply with a concise 3–5 sentence summary suitable for a live dashboard. Be specific and actionable.`;

export async function POST() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseKey) {
      return Response.json({ error: 'Supabase not configured' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } });

    const results = [];
    for (const projectId of DASHBOARD_PROJECT_IDS) {
      const projectName = getProjectLabel(projectId);
      const projectUrl = getProjectRootUrl(projectId) || '';

      await supabase.from('empire_project_analysis').upsert(
        { project_id: projectId, status: 'running', updated_at: new Date().toISOString() },
        { onConflict: 'project_id' }
      );
      await supabase.from('empire_supervisor_log').insert({
        message: `Fleet analysis: Analyzing ${projectName} (${projectId})…`,
        project_id: projectId,
        team_id: 'FLEET_ANALYSIS',
      });

      let summary = '';
      let status = 'done';
      let error_message = null;

      try {
        summary = await runTaskWithZeroClaw(projectId, 'ai-seo', FLEET_ANALYSIS_TASK, { timeoutMs: 60_000 });
        await supabase.from('empire_supervisor_log').insert({
          message: `Fleet analysis: ${projectName} — done.`,
          project_id: projectId,
          team_id: 'FLEET_ANALYSIS',
        });
      } catch (err) {
        status = 'failed';
        error_message = err?.message || String(err);
        summary = '';
        await supabase.from('empire_supervisor_log').insert({
          message: `Fleet analysis: ${projectName} — failed. ${error_message.slice(0, 80)}`,
          project_id: projectId,
          team_id: 'FLEET_ANALYSIS',
        });
      }

      await supabase.from('empire_project_analysis').upsert(
        {
          project_id: projectId,
          summary: summary || null,
          status,
          error_message,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'project_id' }
      );

      results.push({ project_id: projectId, status, summary: summary?.slice(0, 200) || null });
    }

    return Response.json({ ok: true, results });
  } catch (err) {
    return Response.json({ error: err?.message || 'Analyze all failed' }, { status: 500 });
  }
}
