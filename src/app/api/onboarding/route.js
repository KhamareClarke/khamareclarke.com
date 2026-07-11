import { NextResponse } from 'next/server';
import { isAuthenticated, isAdmin } from '@/lib/auth';
import { supabase, supabaseAdmin, hasSupabase } from '@/lib/supabase';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_BODY_BYTES = 20_000;

export async function GET() {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!(await isAdmin())) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (!hasSupabase()) {
      return NextResponse.json({
        clients: [],
        message: 'Database not configured.',
      });
    }

    const client = supabaseAdmin || supabase;
    const { data, error } = await client
      .from('onboarding_clients')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ clients: data || [] });
  } catch (err) {
    console.error('Onboarding fetch error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    // Reject oversized payloads
    const contentLength = Number(req.headers.get('content-length') || 0);
    if (contentLength > MAX_BODY_BYTES) {
      return NextResponse.json({ error: 'Payload too large' }, { status: 413 });
    }

    const body = await req.json();

    // Honeypot: bots fill this, humans don't
    if (body._hp) {
      return NextResponse.json({ success: true }); // silent reject
    }

    // Required fields
    if (!body.email || !EMAIL_RE.test(body.email)) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }
    if (!body.contactName || typeof body.contactName !== 'string' || body.contactName.trim().length < 2) {
      return NextResponse.json({ error: 'Contact name is required' }, { status: 400 });
    }

    if (!hasSupabase()) {
      console.log('Onboarding submission (no DB):', body);
      return NextResponse.json({
        success: true,
        message: 'Received (database not configured)',
      });
    }

    const insertData = {
      contact_name: String(body.contactName || '').slice(0, 200).trim(),
      email: String(body.email || '').slice(0, 320).toLowerCase().trim(),
      phone: String(body.phone || '').slice(0, 30).trim() || null,
      company_name: String(body.companyName || '').slice(0, 200).trim() || null,
      business_type: String(body.businessType || '').slice(0, 100).trim() || null,
      industry: String(body.industry || '').slice(0, 100).trim() || null,
      current_challenges: String(body.currentChallenges || '').slice(0, 2000).trim() || null,
      goals: String(body.goals || '').slice(0, 2000).trim() || null,
      timeline: String(body.timeline || '').slice(0, 100).trim() || null,
      budget: String(body.budget || '').slice(0, 100).trim() || null,
      created_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('onboarding_clients').insert(insertData);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Onboarding save error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
