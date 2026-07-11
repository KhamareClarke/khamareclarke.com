import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/api-guard';
import { generateClientReport } from '@/lib/empire-client-report';

export const maxDuration = 90;

/**
 * POST /api/admin/reports/generate
 * Body: { client_id, project_id }
 * Admin-only. Generates a monthly client report and persists to
 * client_projects.last_report_text / last_report_at.
 */
export async function POST(req) {
  const guard = await requireAuth();
  if (guard) return guard;

  try {
    const body = await req.json().catch(() => ({}));
    const clientId = String(body.client_id || '').trim();
    const projectId = String(body.project_id || '').trim();
    if (!clientId || !projectId) {
      return NextResponse.json({ error: 'client_id and project_id required' }, { status: 400 });
    }

    const { text, at } = await generateClientReport({ clientId, projectId });
    return NextResponse.json({ ok: true, text, at });
  } catch (err) {
    console.error('Report generate error:', err);
    return NextResponse.json({ error: err.message || 'Failed' }, { status: 500 });
  }
}
