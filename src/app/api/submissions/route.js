import { NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { supabase, supabaseAdmin, hasSupabase } from '@/lib/supabase';

export async function GET() {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
    const body = await req.json();
    const { source = 'contact', ...data } = body;

    if (!hasSupabase()) {
      console.log('Form submission (no DB):', { source, ...data });
      return NextResponse.json({
        success: true,
        message: 'Received (database not configured)',
      });
    }

    const { error } = await supabase.from('form_submissions').insert({
      source,
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
