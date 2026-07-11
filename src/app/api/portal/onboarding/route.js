import { NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase-server';
import { supabaseAdmin } from '@/lib/supabase';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_BODY_BYTES = 20_000;

/**
 * POST /api/portal/onboarding
 * Authenticated onboarding submission from /portal/onboarding.
 * Associates the row with the logged-in Supabase user's user_id.
 */
export async function POST(req) {
  try {
    const contentLength = Number(req.headers.get('content-length') || 0);
    if (contentLength > MAX_BODY_BYTES) {
      return NextResponse.json({ error: 'Payload too large' }, { status: 413 });
    }

    const supabase = await getSupabaseServer();
    const { data: { user }, error: authErr } = await supabase.auth.getUser();
    if (authErr || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    if (body._hp) return NextResponse.json({ success: true }); // honeypot

    if (!body.email || !EMAIL_RE.test(body.email)) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }
    if (!body.contactName || String(body.contactName).trim().length < 2) {
      return NextResponse.json({ error: 'Contact name is required' }, { status: 400 });
    }

    const insertData = {
      user_id: user.id,
      contact_name: String(body.contactName || '').slice(0, 200).trim(),
      email: String(body.email || '').slice(0, 320).toLowerCase().trim(),
      phone: String(body.phone || '').slice(0, 30).trim() || null,
      company_name: String(body.companyName || '').slice(0, 200).trim() || null,
      website: String(body.website || '').slice(0, 300).trim() || null,
      business_type: String(body.businessType || '').slice(0, 100).trim() || null,
      industry: String(body.industry || '').slice(0, 100).trim() || null,
      current_challenges: String(body.currentChallenges || '').slice(0, 2000).trim() || null,
      goals: String(body.goals || '').slice(0, 2000).trim() || null,
      timeline: String(body.timeline || '').slice(0, 100).trim() || null,
      budget: String(body.budget || '').slice(0, 100).trim() || null,
      created_at: new Date().toISOString(),
    };

    // Use service role for the insert (bypasses RLS on onboarding_clients which has no client policies).
    const client = supabaseAdmin;
    if (!client) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }
    const { error } = await client.from('onboarding_clients').insert(insertData);
    if (error) throw error;

    // Update profiles.full_name / company for convenience.
    await client
      .from('profiles')
      .update({
        full_name: insertData.contact_name,
        company: insertData.company_name,
      })
      .eq('id', user.id);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Portal onboarding save error:', err);
    return NextResponse.json({ error: err.message || 'Failed' }, { status: 500 });
  }
}
