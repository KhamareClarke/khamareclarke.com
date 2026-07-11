import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/api-guard';
import { supabaseAdmin } from '@/lib/supabase';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * POST /api/admin/invite
 * Body: { email, fullName?, company? }
 * Admin-only. Sends a Supabase magic-link invite. Creates the profile row via
 * the auth.users trigger once accepted. Optionally patches full_name/company.
 */
export async function POST(req) {
  const guard = await requireAuth();
  if (guard) return guard;

  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Service role not configured' }, { status: 503 });
    }

    const body = await req.json().catch(() => ({}));
    const email = String(body.email || '').trim().toLowerCase();
    const fullName = String(body.fullName || '').trim() || null;
    const company = String(body.company || '').trim() || null;

    if (!email || !EMAIL_RE.test(email)) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
      data: { full_name: fullName, invited_via: 'jarvis-portal' },
    });
    if (error) throw error;

    const userId = data?.user?.id;
    if (userId) {
      // Upsert profile (trigger may have created it already with defaults).
      await supabaseAdmin.from('profiles').upsert({
        id: userId,
        role: 'client',
        full_name: fullName,
        company,
      });
    }

    return NextResponse.json({ ok: true, userId });
  } catch (err) {
    console.error('Invite error:', err);
    return NextResponse.json(
      { error: err.message || 'Invite failed' },
      { status: 500 }
    );
  }
}
