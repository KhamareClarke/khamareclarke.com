import { requireAuth } from '@/lib/api-guard';
import { getSupabaseServer } from '@/lib/supabase-server';
import { getUpcomingEvents } from '@/lib/jarvis/calendar';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function buildTimeRange(range, day) {
  const now = new Date();

  if (range === 'today' || !range) {
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    const end = new Date(now);
    end.setHours(23, 59, 59, 999);
    return { timeMin: now.toISOString(), timeMax: end.toISOString() };
  }

  if (range === 'week') {
    const end = new Date(now);
    end.setDate(now.getDate() + 7);
    return { timeMin: now.toISOString(), timeMax: end.toISOString() };
  }

  // Named day: "tomorrow", "monday", etc.
  if (day) {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const target = days.indexOf(day.toLowerCase());
    if (target !== -1) {
      const d = new Date(now);
      const diff = (target - d.getDay() + 7) % 7 || 7;
      d.setDate(d.getDate() + diff);
      d.setHours(0, 0, 0, 0);
      const end = new Date(d);
      end.setHours(23, 59, 59, 999);
      return { timeMin: d.toISOString(), timeMax: end.toISOString() };
    }
    if (day.toLowerCase() === 'tomorrow') {
      const d = new Date(now);
      d.setDate(d.getDate() + 1);
      d.setHours(0, 0, 0, 0);
      const end = new Date(d);
      end.setHours(23, 59, 59, 999);
      return { timeMin: d.toISOString(), timeMax: end.toISOString() };
    }
  }

  // Default: next 24 hours.
  const end = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  return { timeMin: now.toISOString(), timeMax: end.toISOString() };
}

export async function POST(req) {
  const authError = await requireAuth();
  if (authError) return authError;

  let range, day;
  try {
    ({ range, day } = await req.json());
  } catch {
    return Response.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const supabase = await getSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { timeMin, timeMax } = buildTimeRange(range, day);
  const events = await getUpcomingEvents(user.id, { maxResults: 20, timeMin, timeMax });

  if (events === null) {
    return Response.json({ notConnected: true });
  }

  return Response.json({ events, range: range || 'today', timeMin, timeMax });
}
