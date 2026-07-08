/**
 * GET live worker output (empire-worker-live.log) so the dashboard can show progress while the worker runs.
 */
import fs from 'fs';
import path from 'path';
import { requireAuth } from '@/lib/api-guard';

export const dynamic = 'force-dynamic';

export async function GET() {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    const logPath = path.join(process.cwd(), 'empire-worker-live.log');
    if (!fs.existsSync(logPath)) {
      return Response.json({ ok: true, log: '' });
    }
    const log = fs.readFileSync(logPath, 'utf8');
    return Response.json({ ok: true, log: log.slice(-12000) });
  } catch (err) {
    return Response.json({ ok: false, log: '', error: err?.message }, { status: 500 });
  }
}
