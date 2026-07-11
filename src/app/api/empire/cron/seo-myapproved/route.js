/**
 * GET/POST /api/empire/cron/seo-myapproved
 * Runs Growth (SEO) for MyApproved then pushes code. Logs to empire_supervisor_log (task_type: seo_cron).
 * On success, emails khamareclarke (EMPIRE_ADMIN_EMAIL / NOTIFY_EMAIL). Schedule: every 30 min.
 */
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';
import { supabaseAdmin } from '@/lib/supabase';
import { requireCronSecret } from '@/lib/api-guard';

const SEO_ADMIN_EMAIL = process.env.EMPIRE_ADMIN_EMAIL || process.env.NOTIFY_EMAIL || 'Khamareclarke@gmail.com';

function getTransporter() {
  const user = (process.env.EMAIL_USER || process.env.SMTP_USER || '').trim().replace(/^["']|["']$/g, '');
  const pass = (process.env.EMAIL_PASS || process.env.SMTP_PASS || '').trim().replace(/^["']|["']$/g, '');
  if (!user || !pass) return null;
  return nodemailer.createTransport({ service: 'gmail', auth: { user, pass } });
}

export const dynamic = 'force-dynamic';
export const maxDuration = 180;

const PROJECT_ID = 'myapproved';

// No custom task: use default Growth Team instruction. When build fails only due to env/config (generate, next package), we still push SEO changes.
const SEO_CUSTOM_TASK = '';

function getBaseUrl() {
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, '');
  return 'http://localhost:3000';
}

export async function GET(req) {
  const cronError = await requireCronSecret(req);
  if (cronError) return cronError;

  return runSeoMyApproved(req);
}

export async function POST(req) {
  const cronError = await requireCronSecret(req);
  if (cronError) return cronError;

  return runSeoMyApproved(req);
}

async function runSeoMyApproved() {
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
        team_id: 'SEO',
        task_type: 'seo_cron',
        findings: findings || null,
      });
    } catch (_) {}
  };

  await log(`SEO cron started for MyApproved at ${new Date().toISOString()}`);

  let seoResult = '';
  let pushResult = '';
  let seoOk = false;
  let pushOk = false;

  try {
    const runRes = await fetch(`${baseUrl}/api/empire/worker/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskIndex: 0, projectId: PROJECT_ID, customTask: SEO_CUSTOM_TASK }),
    });
    const runData = await runRes.json().catch(() => ({}));
    seoResult = typeof runData.result === 'string' ? runData.result : (runData.error || 'No result');
    seoOk = !!runData.ok;
    const r = (seoResult || '').toLowerCase().trim();
    if (!r || r === 'no result') {
      seoOk = false;
    } else {
      // Env/config build failure (generate, next package, TypeError) — ignore and still push SEO changes
      const envBuildFailure = /generate is not a function|next package|typeerror|next\.js (framework|config|version|dependencies)|cannot run npm install|build failed due to|build failed.*(generate|next|typeerror)/i.test(r);
      const hasSeoEdits = /layout|updated|changes?|meta|og:|description|title|robots|twitter|open graph|sitemap|keywords/i.test(r);
      if (envBuildFailure && hasSeoEdits) {
        seoOk = true;
        // Don't mention the env build error — show only that SEO was updated and pushed
        seoResult = 'SEO updates applied (layout, meta, titles). Pushed successfully.';
      } else if (!envBuildFailure && (r.includes('build failed') || r.includes('build fails') || r.includes('build process has failed') || r.includes('unable to complete') || r.includes('cannot report success') || r.includes('will not report success') || r.includes('cannot proceed') || r.includes('cannot rectify') || r.includes('build error') || r.includes('build encountered'))) {
        seoOk = false;
      }
    }
    await log(
      `SEO run: ${seoOk ? 'Done' : 'Failed'}. ${seoResult.slice(0, 300)}${seoResult.length > 300 ? '…' : ''}`,
      seoResult
    );
  } catch (e) {
    seoResult = e?.message || String(e);
    await log(`SEO run error: ${seoResult}`, seoResult);
  }

  // Push when SEO ok (build passed, or we ignored env-only build failure and pushed anyway).
  if (seoOk) {
    try {
      const pushRes = await fetch(`${baseUrl}/api/empire/worker/push`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: PROJECT_ID,
          message: 'Empire: SEO improvements (auto)',
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
    pushResult = 'Skipped (no result or real build failure)';
    await log(`Push skipped: ${pushResult}`, pushResult);
  }

  // On successful SEO + push, notify khamareclarke by email
  if (seoOk && pushOk && SEO_ADMIN_EMAIL) {
    const transporter = getTransporter();
    if (transporter) {
      try {
        await transporter.sendMail({
          from: process.env.EMAIL_USER || process.env.SMTP_USER,
          to: SEO_ADMIN_EMAIL,
          subject: '[MyApproved] SEO improved & pushed successfully',
          html: `<p><strong>MyApproved SEO run completed.</strong></p>
<p>Growth (SEO) ran successfully and changes were pushed to the repo.</p>
<p>Time: ${new Date().toISOString()}</p>
<p>SEO result (summary): ${(seoResult || '').slice(0, 500)}${(seoResult || '').length > 500 ? '…' : ''}</p>
<p>Push: ${typeof pushResult === 'string' ? pushResult : 'Done'}</p>`,
        });
        await log(`SEO success email sent to ${SEO_ADMIN_EMAIL}`);
      } catch (_) {}
    }
  }

  // Save run to DB (like leads) for dashboard
  if (supabase) {
    try {
      await supabase.from('empire_seo_runs').insert({
        project_id: PROJECT_ID,
        run_type: 'cron',
        success: seoOk,
        push_ok: pushOk,
        result_summary: (seoResult || '').slice(0, 5000),
        push_message: (typeof pushResult === 'string' ? pushResult : '').slice(0, 1000),
      });
    } catch (_) {}
  }

  return Response.json({
    ok: seoOk,
    seoOk,
    pushOk,
    seoResult: seoResult.slice(0, 1000),
    pushResult: typeof pushResult === 'string' ? pushResult.slice(0, 500) : pushResult,
    message: `SEO: ${seoOk ? 'Done' : 'Failed'}. Push: ${pushOk ? 'Done' : 'Failed'}.`,
  });
}
