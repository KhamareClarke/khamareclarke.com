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
    const body = await req.json();

    if (!hasSupabase()) {
      console.log('Onboarding submission (no DB):', body);
      return NextResponse.json({
        success: true,
        message: 'Received (database not configured)',
      });
    }

    // Map camelCase form fields to snake_case DB columns
    const insertData = {
      contact_name: body.contactName,
      email: body.email,
      phone: body.phone,
      company_name: body.companyName,
      business_type: body.businessType,
      industry: body.industry,
      current_challenges: body.currentChallenges,
      goals: body.goals,
      timeline: body.timeline,
      budget: body.budget,
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
