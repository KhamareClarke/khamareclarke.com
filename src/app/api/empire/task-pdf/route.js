/**
 * Empire task PDF — generate a clean PDF report for a completed task.
 * GET /api/empire/task-pdf?taskId=xxx returns application/pdf.
 */
import { createClient } from '@supabase/supabase-js';

// eslint-disable-next-line @next/next/no-assign-module-variable
const PDFDocument = require('pdfkit');

export const dynamic = 'force-dynamic';

function getProjectLabel(id) {
  const labels = {
    myapproved: 'MyApproved', khamareclarke: 'KhamareClarke.com', omniwtms: 'Omni WTMS',
    leverageacademy: 'Leverage Academy', fliprepublic: 'Flip Republic', leveragejournal: 'Leverage Journal',
    inboker: 'Inboker', identitymarketing: 'Identimarketing', adstarter: 'Ads Starter',
    seoinforce: 'SEO In Force', alkemmy: 'Alkhemmy', empire: 'Empire', 'empire-phase11-test': 'Empire (verification)',
  };
  return labels[id] || (id || '').replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function stripMarkdown(text) {
  if (!text || typeof text !== 'string') return '';
  return text
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/^#+\s*/gm, '')
    .trim();
}

function getSkillLabel(id) {
  const labels = {
    'seo-audit': 'SEO Audit', 'copywriting': 'Copywriting', 'marketing-psychology': 'Marketing Psychology',
    'programmatic-seo': 'Programmatic SEO', 'content-strategy': 'Content Strategy', 'ai-seo': 'AI SEO',
    'marketing-ideas': 'Marketing Ideas', 'cold-email': 'Cold Email', 'email-sequence': 'Email Sequence',
    'ad-creative': 'Ad Creative', 'onboarding-cro': 'Onboarding CRO', 'page-cro': 'Page CRO',
    'copy-editing': 'Copy Editing', 'competitor-alternatives': 'Competitor & Alternatives', 'social-content': 'Social Content',
    'analytics-tracking': 'Analytics & Tracking', 'schema-markup': 'Schema Markup', 'form-cro': 'Form CRO',
  };
  return labels[id] || (id || '').replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const taskId = searchParams.get('taskId');
    if (!taskId) {
      return new Response('taskId required', { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseKey) {
      return new Response('Supabase not configured', { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } });
    const { data: task, error } = await supabase
      .from('empire_tasks')
      .select('id, project_id, agent_id, task_description, status, assigned_at, completed_at, result_message')
      .eq('id', taskId)
      .single();

    if (error || !task) {
      return new Response('Task not found', { status: 404 });
    }

    const projectLabel = getProjectLabel(task.project_id);
    const agentLabel = getSkillLabel(task.agent_id);
    const assignedDate = task.assigned_at ? new Date(task.assigned_at).toLocaleString() : '—';
    const completedDate = task.completed_at ? new Date(task.completed_at).toLocaleString() : '—';
    const result = stripMarkdown((task.result_message || '').trim()) || 'No result.';

    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const chunks = [];
    doc.on('data', (chunk) => chunks.push(chunk));
    const bufferPromise = new Promise((resolve, reject) => {
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);
    });

    doc.fontSize(18).font('Helvetica-Bold').text('Empire Task Report', { align: 'center' });
    doc.moveDown(1);
    doc.fontSize(10).font('Helvetica');
    doc.text(`Project: ${projectLabel}`, { continued: false });
    doc.text(`Agent: ${agentLabel}`, { continued: false });
    doc.text(`Assigned: ${assignedDate}`, { continued: false });
    doc.text(`Completed: ${completedDate}`, { continued: false });
    doc.text(`Status: ${task.status}`, { continued: false });
    doc.moveDown(0.5);
    doc.font('Helvetica-Bold').text('Task', { continued: false });
    doc.font('Helvetica').text(task.task_description || '—', { lineGap: 2 });
    doc.moveDown(0.5);
    doc.font('Helvetica-Bold').text('Result', { continued: false });
    doc.font('Helvetica').text(result, { lineGap: 3, align: 'left' });
    doc.end();

    const buffer = await bufferPromise;

    const filename = `empire-${(projectLabel || 'task').replace(/\s+/g, '-')}-${(agentLabel || 'report').replace(/\s+/g, '-')}-${taskId.slice(0, 8)}.pdf`;

    return new Response(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': String(buffer.length),
      },
    });
  } catch (err) {
    console.error('task-pdf error:', err);
    return new Response(err?.message || 'PDF generation failed', { status: 500 });
  }
}
