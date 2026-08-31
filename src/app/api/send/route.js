import { NextResponse } from "next/server";
import { supabase, hasSupabase, pushLeadToEmpire } from "@/lib/supabase";
import { createGHLContact } from "@/lib/ghl";

export async function POST(req) {
  const { name, email, phone, businessType, message, subject } = await req.json();
  console.log('Send API called:', { name, email, phone, businessType, message, subject });

  // Determine the source of the form
  const formSource = businessType ? 'business-bundle' : 'contact';

  // Save to control centre database
  if (hasSupabase()) {
    try {
      await supabase.from('form_submissions').insert({
        source: formSource,
        data: { name, email, phone, businessType, message, subject },
        created_at: new Date().toISOString(),
      });
    } catch (_) {}
  }

  // Push lead to Empire dashboard (central empire_leads)
  try {
    await pushLeadToEmpire({
      source: formSource,
      email: email || null,
      name: name || null,
      payload: { phone, businessType, message, subject },
    });
  } catch (_) {}

  // Create the contact in GoHighLevel CRM
  const ghlResult = await createGHLContact({
    firstName: name ? name.trim().split(/\s+/)[0] : '',
    lastName: name ? name.trim().split(/\s+/).slice(1).join(' ') : '',
    email: email || '',
    phone: phone || '',
    tags: [formSource === 'business-bundle' ? 'business-bundle' : 'website-contact'],
    customField: {
      subject: subject || '',
      message: message || '',
      source: formSource,
    },
  });

  if (!ghlResult) {
    console.error('GHL contact creation failed (GHL_API_KEY unset or API error)');
    console.log('Form data received (no GHL contact created):', { name, email, phone, businessType, message, subject });
    return NextResponse.json({
      success: true,
      message: 'Form received (CRM not configured)'
    });
  }

  console.log('GHL contact created:', ghlResult);
  return NextResponse.json({ success: true, message: 'Form received' });
}
