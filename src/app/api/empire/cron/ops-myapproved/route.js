/**
 * GET/POST /api/empire/cron/ops-myapproved
 * Runs Ops (bugs & broken links) for MyApproved: finds and fixes bugs/broken links, pushes code, emails Khamareclarke on success.
 * Schedule: every 30 min (same as SEO). Logs to empire_supervisor_log (task_type: ops_cron).
 */
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';
import { supabaseAdmin } from '@/lib/supabase';
import { requireCronSecret } from '@/lib/api-guard';

const PROJECT_ID = 'myapproved';
const OPS_ADMIN_EMAIL = process.env.EMPIRE_ADMIN_EMAIL || process.env.NOTIFY_EMAIL || 'Khamareclarke@gmail.com';

const OPS_CUSTOM_TASK = `Ops Team (Bugs & Broken Links). For MyApproved only. You MAY edit files to fix build errors, but every edit must be safe—never introduce a single new error.

RULES (follow every time you use write_file):

1) FULL FILE ONLY. Before writing, call read_file to get the entire file. Your write_file content MUST be the complete file: same length or longer, with only the minimal change. Never omit the end of the file. Never leave a string, template literal, or JSX tag unclosed. Never truncate.

2) NO BROKEN SYNTAX. Use normal double quote " or single quote ' for strings. Never write backslash-quote (e.g. \\") inside the file content. For text with apostrophes use double-quoted strings: "UK's" not \\"UK's\\". Never remove a closing bracket, brace, or tag.

3) URL FIXES. If you fix app/layout.tsx or any URL: VERCEL_URL is hostname-only. Use "https://" + process.env.VERCEL_URL or baseUrl = process.env.VERCEL_URL ? "https://" + process.env.VERCEL_URL : "https://myapproved.com". Never pass raw VERCEL_URL to new URL().

4) ONE FIX PER WRITE. Change only the exact line(s) the build error points to. Keep every other line identical. Then run "npm run build" again. Only report success when build passes. If build fails after your edit, fix again following these same rules.`;

function getTransporter() {
  const user = (process.env.EMAIL_USER || process.env.SMTP_USER || '').trim().replace(/^["']|["']$/g, '');
  const pass = (process.env.EMAIL_PASS || process.env.SMTP_PASS || '').trim().replace(/^["']|["']$/g, '');
  if (!user || !pass) return null;
  return nodemailer.createTransport({ service: 'gmail', auth: { user, pass } });
}

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

  return runOpsMyApproved(req);
}

export async function POST(req) {
  const cronError = await requireCronSecret(req);
  if (cronError) return cronError;

  return runOpsMyApproved(req);
}

async function runOpsMyApproved() {
  const baseUrl = getBaseUrl();
  const supabase = supabaseAdmin || (() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    return url && key ? createClient(url, key, { auth: { persistSession: false } }) : null;
  })();

  const log = async (message, findings) => {
    if (!supabase) return;
    try {
      await supabase.from('empire_supervisor_log').insert({
        message,
        project_id: PROJECT_ID,
        team_id: 'OPS',
        task_type: 'ops_cron',
        findings: findings || null,
      });
    } catch (_) {}
  };

  await log(`Ops cron (bugs & broken links) started for MyApproved at ${new Date().toISOString()}`);

  // Save a "started" row immediately so the dashboard shows the cron is running (even if we timeout later)
  let insertStartError = null;
  if (supabase) {
    const { error } = await supabase.from('empire_ops_runs').insert({
      project_id: PROJECT_ID,
      run_type: 'cron',
      success: false,
      push_ok: false,
      result_summary: 'Ops cron started (worker running…)',
      push_message: null,
    });
    if (error) insertStartError = error.message;
  }

  let opsResult = '';
  let pushResult = '';
  let opsOk = false;
  let pushOk = false;

  try {
    const runRes = await fetch(`${baseUrl}/api/empire/worker/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskIndex: 2, projectId: PROJECT_ID, customTask: OPS_CUSTOM_TASK }),
    });
    const runData = await runRes.json().catch(() => ({}));
    opsResult = typeof runData.result === 'string' ? runData.result : (runData.error || 'No result');
    opsOk = !!runData.ok;
    const r = (opsResult || '').toLowerCase();
    if (r.includes('build failed') || r.includes('build fails') || r.includes('build process has failed') || r.includes('generate is not a function') || r.includes('unable to complete') || r.includes('cannot report success') || r.includes('will not report success') || r.includes('cannot proceed') || r.includes('cannot rectify')) {
      opsOk = false;
    }
    await log(
      `Ops run: ${opsOk ? 'Done' : 'Failed'}. ${opsResult.slice(0, 300)}${opsResult.length > 300 ? '…' : ''}`,
      opsResult
    );
  } catch (e) {
    opsResult = e?.message || String(e);
    await log(`Ops run error: ${opsResult}`, opsResult);
  }

  // Only push when worker reported success (build passed). No push if build failed.
  if (opsOk) {
    try {
      const pushRes = await fetch(`${baseUrl}/api/empire/worker/push`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: PROJECT_ID,
          message: 'Empire: fix bugs and broken links (auto)',
        }),
      });
      const pushData = await pushRes.json().catch(() => ({}));
      pushOk = !!pushData.ok;
      pushResult = pushData.ok ? (pushData.log || 'Pushed.') : (pushData.error || pushData.log || 'Push failed');
      await log(
        `Push: ${pushOk ? 'Done' : 'Failed'}. ${typeof pushResult === 'string' ? pushResult.slice(0, 200) : pushResult}`,
        typeof pushResult === 'string' ? pushResult : null
      );
    } catch (e) {
      pushResult = e?.message || String(e);
      await log(`Push error: ${pushResult}`, pushResult);
    }
  } else {
    pushResult = 'Skipped (build failed or worker did not report success)';
    await log(`Push skipped: ${pushResult}`, pushResult);
  }

  if (opsOk && pushOk && OPS_ADMIN_EMAIL) {
    const transporter = getTransporter();
    if (transporter) {
      try {
        await transporter.sendMail({
          from: process.env.EMAIL_USER || process.env.SMTP_USER,
          to: OPS_ADMIN_EMAIL,
          subject: '[MyApproved] Bugs & broken links fixed and pushed',
          html: `<p><strong>MyApproved Ops run completed.</strong></p>
<p>Bugs and broken links were checked; fixes were pushed to the repo.</p>
<p>Time: ${new Date().toISOString()}</p>
<p>Ops result (summary): ${(opsResult || '').slice(0, 500)}${(opsResult || '').length > 500 ? '…' : ''}</p>
<p>Push: ${typeof pushResult === 'string' ? pushResult : 'Done'}</p>`,
        });
        await log(`Ops success email sent to ${OPS_ADMIN_EMAIL}`);
      } catch (_) {}
    }
  }

  // Save run to DB (like leads) for dashboard. Show Push = Yes when run succeeded (push may be disabled or no changes)
  let insertEndError = null;
  if (supabase) {
    const { error } = await supabase.from('empire_ops_runs').insert({
      project_id: PROJECT_ID,
      run_type: 'cron',
      success: opsOk,
      push_ok: pushOk || opsOk,
      result_summary: (opsResult || '').slice(0, 5000),
      push_message: (typeof pushResult === 'string' ? pushResult : '').slice(0, 1000),
    });
    if (error) insertEndError = error.message;
  }

  return Response.json({
    ok: opsOk,
    opsOk,
    pushOk,
    opsResult: opsResult.slice(0, 1000),
    pushResult: typeof pushResult === 'string' ? pushResult.slice(0, 500) : pushResult,
    message: `Ops: ${opsOk ? 'Done' : 'Failed'}. Push: ${pushOk ? 'Done' : 'Failed'}.`,
    supabase: supabase ? 'connected' : 'no_client',
    insertStartError: insertStartError || undefined,
    insertEndError: insertEndError || undefined,
  });
}
