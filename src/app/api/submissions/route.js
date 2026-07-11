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
        submissions: [],
        message: 'Database not configured. Add Supabase env vars to store submissions.',
      });
    }

    const client = supabaseAdmin || supabase;
    const { data, error } = await client
      .from('form_submissions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ submissions: data || [] });
  } catch (err) {
    console.error('Submissions fetch error:', err);
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
    const { source = 'contact', _hp, ...data } = body;

    // Honeypot: bots fill this, humans don't
    if (_hp) {
      return NextResponse.json({ success: true }); // silent reject
    }

    // Require email on contact-form submissions
    if (source === 'contact') {
      if (!data.email || !EMAIL_RE.test(data.email)) {
        return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
      }
      if (!data.name && !data.message) {
        return NextResponse.json({ error: 'Name or message required' }, { status: 400 });
      }
    }

    if (!hasSupabase()) {
      console.log('Form submission (no DB):', { source, ...data });
      return NextResponse.json({
        success: true,
        message: 'Received (database not configured)',
      });
    }

    const { error } = await supabase.from('form_submissions').insert({
      source: String(source).slice(0, 64),
      data,
      created_at: new Date().toISOString(),
    });

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Submission save error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
