/**
 * POST /api/empire/leads/send-outreach
 * Sends outreach emails about MyApproved via Gmail SMTP (nodemailer), marks leads contacted,
 * and notifies admin for each lead emailed. Env: EMAIL_USER, EMAIL_PASS (Gmail App Password).
 */
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const ADMIN_EMAIL = process.env.EMPIRE_ADMIN_EMAIL || process.env.NOTIFY_EMAIL || 'Khamareclarke@gmail.com';
const DEFAULT_LIMIT = 50;

function stripQuotes(s) {
  if (typeof s !== 'string') return s;
  const t = s.trim();
  if ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'"))) return t.slice(1, -1).trim();
  return t;
}

function getTransporter() {
  const user = stripQuotes(process.env.EMAIL_USER || process.env.SMTP_USER || '');
  const pass = stripQuotes(process.env.EMAIL_PASS || process.env.SMTP_PASS || '');
  if (!user || !pass) return null;
  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  });
}

function buildOutreachEmail(lead) {
  const name = lead.name || lead.email?.split('@')[0] || 'there';
  const subject = 'MyApproved – get more jobs and simplify compliance (UK & Canada)';
  const html = `
<p>Hi ${name},</p>
<p>I run <strong>MyApproved</strong> – we help tradespeople and contractors in the UK and Canada win more work and stay compliant.</p>
<p>If you’d like more leads and less admin, take a look: <a href="https://myapproved.com">myapproved.com</a></p>
<p>Happy to answer any questions.</p>
<p>Best regards</p>
  `.trim();
  return { subject, html };
}

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const projectId = (body.projectId || process.env.EMPIRE_AUTO_24H_PROJECT_ID || 'myapproved').trim().toLowerCase();
    const limit = Math.min(Number(body.limit) || DEFAULT_LIMIT, 100);
    const notifyAdmin = body.notifyAdmin !== false;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const transporter = getTransporter();
    if (!supabaseUrl || !supabaseKey) return Response.json({ error: 'Supabase not configured' }, { status: 500 });
    if (!transporter) return Response.json({ error: 'Gmail SMTP not configured. Set EMAIL_USER and EMAIL_PASS (App Password).' }, { status: 500 });

    const fromEmail = stripQuotes(process.env.EMAIL_USER || process.env.SMTP_USER || '') || 'Khamareclarke@gmail.com';
    const supabase = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } });

    const { data: rows, error: fetchErr } = await supabase
      .from('empire_leads')
      .select('id, email, name, payload, contacted')
      .eq('project_id', projectId)
      .not('email', 'is', null)
      .or('contacted.is.null,contacted.eq.false')
      .limit(limit * 3);

    if (fetchErr) return Response.json({ error: fetchErr.message }, { status: 500 });
    let candidates = (rows || []).filter(
      (r) => (r.contacted !== true && !(r.payload && r.payload.contacted))
    );
    const seenEmails = new Set();
    const leads = [];
    for (const r of candidates) {
      const e = (r.email || '').trim().toLowerCase();
      if (!e || seenEmails.has(e)) continue;
      seenEmails.add(e);
      leads.push(r);
      if (leads.length >= limit) break;
    }
    if (!leads?.length) {
      return Response.json({
        ok: true,
        sent: 0,
        message: 'No uncontacted leads with email. Many scraped leads have no email (—); only those with email get outreach. Next run will fetch more.',
      });
    }

    const results = { sent: 0, failed: 0, errors: [], notified: 0 };
    const contactedAt = new Date().toISOString();

    for (const lead of leads) {
      const email = lead.email?.trim();
      if (!email) continue;
      const { subject, html } = buildOutreachEmail(lead);
      try {
        await transporter.sendMail({
          from: fromEmail,
          to: email,
          subject,
          html: `<div style="font-family: sans-serif;">${html}</div>`,
        });
        results.sent++;
        const payload = { ...(lead.payload || {}), contacted: true, contacted_at: contactedAt };
        await supabase
          .from('empire_leads')
          .update({
            contacted: true,
            contacted_at: contactedAt,
            payload,
            updated_at: contactedAt,
          })
          .eq('id', lead.id);
        await supabase
          .from('empire_leads')
          .update({ contacted: true, contacted_at: contactedAt, updated_at: contactedAt })
          .eq('project_id', projectId)
          .ilike('email', email);

        const logMsg = lead.payload?.website
          ? `Email sent to ${lead.name || email} (${email}) — ${lead.payload.website}`
          : `Email sent to ${lead.name || email} (${email})`;
        try {
          await supabase.from('empire_supervisor_log').insert({
            message: logMsg,
            project_id: projectId,
            team_id: 'Outreach',
            task_type: 'outreach_sent',
          });
        } catch (_) {}

        if (notifyAdmin && ADMIN_EMAIL) {
          try {
            await transporter.sendMail({
              from: fromEmail,
              to: ADMIN_EMAIL,
              subject: `[MyApproved] Lead contacted: ${lead.name || email}`,
              html: `<p><strong>Lead detected for MyApproved – email sent to them.</strong></p><p>Name: ${lead.name || '—'}</p><p>Email: ${email}</p><p>Website: ${lead.payload?.website || '—'}</p><p>Time: ${contactedAt}</p>`,
            });
            results.notified++;
          } catch (_) {}
        }
      } catch (e) {
        results.failed++;
        results.errors.push({ email, error: e?.message || String(e) });
      }
    }

    return Response.json({ ok: true, ...results });
  } catch (err) {
    return Response.json({ error: err?.message || 'Send outreach failed' }, { status: 500 });
  }
}
