/**
 * POST /api/empire/leads/fetch
 * Scrapes leads (DuckDuckGo, Bing, Google), saves to Supabase empire_leads, and returns them.
 */
import * as empireTools from '@/lib/empire-tools.js';
import { supabaseAdmin } from '@/lib/supabase';
import { requireAuth } from '@/lib/api-guard';

export const dynamic = 'force-dynamic';
export const maxDuration = 120;

const OWN_DOMAINS_MYAPPROVED = new Set(['myapproved.com', 'myapproved.co.uk']);

export async function POST(req) {
  const authError = await requireAuth();
  if (authError) return authError;

  let body = {};
  try {
    body = await req.json();
  } catch (_) {}
  const projectId = (body.projectId || 'myapproved').trim().toLowerCase();
  process.env.EMPIRE_WORKER_PROJECT_ID = projectId;

  try {
    const result = await empireTools.scrapeLeads();
    if (!result.ok) {
      return Response.json({
        ok: false,
        error: result.error || 'No leads found this time.',
        leads: [],
      });
    }
    const leads = result.leads || (result.leads_json ? JSON.parse(result.leads_json) : []);
    if (!Array.isArray(leads) || leads.length === 0) {
      return Response.json({ ok: false, error: 'No leads to save.', leads: [] });
    }

    const ownDomains = projectId === 'myapproved' ? OWN_DOMAINS_MYAPPROVED : new Set();
    const filtered = leads.filter((l) => !l.email || !ownDomains.has((l.email.split('@')[1] || '').toLowerCase()));
    if (filtered.length === 0) {
      return Response.json({ ok: false, error: 'All leads were from your own domain.', leads: [] });
    }

    if (!supabaseAdmin) {
      return Response.json({
        ok: false,
        error: 'Supabase not configured. Add SUPABASE_SERVICE_ROLE_KEY to .env.local',
        leads: [],
      });
    }

    const rows = filtered.slice(0, 500).map((l) => ({
      project_id: projectId,
      source: l.source ?? null,
      email: l.email ?? null,
      name: l.name ?? null,
      payload: l.payload ?? {},
      updated_at: new Date().toISOString(),
    }));

    const { data, error } = await supabaseAdmin.from('empire_leads').insert(rows).select('id');
    if (error) {
      return Response.json({
        ok: false,
        error: `Supabase error: ${error.message}. Check that empire_leads table exists and RLS allows service_role.`,
        leads: [],
      });
    }
    const inserted = (data && data.length) || rows.length;
    return Response.json({
      ok: true,
      leads,
      count: leads.length,
      inserted,
    });
  } catch (e) {
    return Response.json({
      ok: false,
      error: e.message || String(e),
      leads: [],
    }, { status: 500 });
  }
}
