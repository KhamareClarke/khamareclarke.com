/**
 * GET last worker run log (empire-worker-last.log).
 */
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const logPath = path.join(process.cwd(), 'empire-worker-last.log');
    if (!fs.existsSync(logPath)) {
      return Response.json({ ok: true, log: null, result: null });
    }
    const raw = fs.readFileSync(logPath, 'utf8');
    let data = {};
    try {
      data = JSON.parse(raw);
    } catch (_) {
      return Response.json({ ok: true, log: raw, result: null });
    }
    return Response.json({ ok: true, log: raw, result: data.result, taskIndex: data.taskIndex, instruction: data.instruction });
  } catch (err) {
    return Response.json({ error: err?.message }, { status: 500 });
  }
}
