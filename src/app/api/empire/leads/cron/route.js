/**
 * GET/POST /api/empire/leads/cron
 * Auto: (1) Fetch new leads (scrape UK/Canada, save to DB), (2) Send MyApproved outreach to
 * uncontacted leads with email, (3) Notify admin for each sent. Runs every 1 min (Vercel cron) or
 * when dashboard pings in background. Writes to empire_supervisor_log for dashboard.
 */
import { createClient } from '@supabase/supabase-js';
import { requireCronSecret } from '@/lib/api-guard';

export const dynamic = 'force-dynamic';
export const maxDuration = 180;

function getBaseUrl() {
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, '');
  return 'http://localhost:3000';
}

export async function GET(req) {
  const cronError = await requireCronSecret(req);
  if (cronError) return cronError;

  return runLeadsCron(req);
}

export async function POST(req) {
  const cronError = await requireCronSecret(req);
  if (cronError) return cronError;

  return runLeadsCron(req);
}

async function runLeadsCron(req) {
  try {
    const url = new URL(req.url || '', getBaseUrl());
    let skipFetch = url.searchParams.get('skipFetch') === '1';
    let skipSend = url.searchParams.get('skipSend') === '1';
    if (req.method === 'POST') {
      try {
        const body = await req.json().catch(() => ({}));
        if (body.skipFetch) skipFetch = true;
        if (body.skipSend) skipSend = true;
      } catch (_) {}
    }

    const baseUrl = getBaseUrl();
    const projectId = 'myapproved';
    let fetchResult = { ok: false, inserted: 0, error: null };
    let sendResult = { ok: false, sent: 0, notified: 0, error: null };

    if (!skipFetch) {
      try {
        const res = await fetch(`${baseUrl}/api/empire/leads/fetch`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ projectId }),
        });
        const data = await res.json().catch(() => ({}));
        fetchResult = {
          ok: !!data.ok,
          inserted: data.inserted ?? 0,
          count: data.count ?? 0,
          error: data.error || null,
        };
      } catch (e) {
        fetchResult.error = e?.message || String(e);
      }
    }

    if (!skipSend) {
      try {
        const res = await fetch(`${baseUrl}/api/empire/leads/send-outreach`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ projectId, limit: 50, notifyAdmin: true }),
        });
        const data = await res.json().catch(() => ({}));
        sendResult = {
          ok: !!data.ok,
          sent: data.sent ?? 0,
          notified: data.notified ?? 0,
          error: data.error || null,
          message: data.message || null,
        };
      } catch (e) {
        sendResult.error = e?.message || String(e);
      }
    }

    const extra = [fetchResult.error, sendResult.error].filter(Boolean).join('; ');
    const sendReason = sendResult.sent === 0 && sendResult.message ? sendResult.message : null;
    const fetched = fetchResult.inserted ?? 0;
    const whyZero =
      fetched === 0 && fetchResult.error
        ? ` ${fetchResult.error}`
        : fetched === 0
          ? ' (Set EMPIRE_LEAD_SOURCE_URL to a JSON API, or EMPIRE_LEAD_SCRAPE_URL to external directory URLs; built-in search often returns 0 from server.)'
          : '';
    const message = extra
      ? `Leads: fetched ${fetched} new, sent ${sendResult.sent ?? 0} emails. ${extra}`
      : sendReason
        ? `Leads: fetched ${fetched} new, sent ${sendResult.sent ?? 0} emails. ${sendReason}`
        : `Leads: fetched ${fetched} new, sent ${sendResult.sent ?? 0} emails, notified admin ${sendResult.notified ?? 0}.${whyZero}`;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (supabaseUrl && supabaseKey) {
      try {
        const supabase = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } });
        await supabase.from('empire_supervisor_log').insert({
          message,
          project_id: projectId,
          team_id: 'Leads',
          task_type: 'leads_cron',
        });
      } catch (_) {}
    }

    return Response.json({
      ok: true,
      fetch: fetchResult,
      send: sendResult,
      message,
    });
  } catch (err) {
    return Response.json(
      { ok: false, error: err?.message || 'Leads cron failed' },
      { status: 500 }
    );
  }
}
