import { NextResponse } from "next/server";
import { Resend } from "resend";
import { supabase, hasSupabase, pushLeadToEmpire } from "@/lib/supabase";

const fromEmail = process.env.FROM_EMAIL || 'noreply@khamareclarke.com';

export async function POST(req, res) {
  const { name, email, phone, businessType, message, subject } = await req.json();
  console.log('Email API called:', { name, email, phone, businessType, message, subject });
  
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
  
  // Check if API key is configured
  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY is not configured');
    // For development, just log the data and return success
    console.log('Form data received (no email sent):', { name, email, phone, businessType, message, subject });
    return NextResponse.json({ 
      success: true, 
      message: 'Form received (email service not configured)' 
    });
  }
  
  // Initialize Resend only when API key is available
  const resend = new Resend(process.env.RESEND_API_KEY);
  
  try {
    // Create HTML email content
    const htmlContent = `
      <h1>${subject || 'New Business Bundle Inquiry'}</h1>
      <p><strong>Lead Information:</strong></p>
      ${name ? `<p><strong>Name:</strong> ${name}</p>` : ''}
      <p><strong>Email:</strong> ${email}</p>
      ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
      ${businessType ? `<p><strong>Business Type:</strong> ${businessType}</p>` : ''}
      ${message ? `
        <p><strong>Message:</strong></p>
        <pre style="white-space: pre-wrap; font-family: monospace;">${message}</pre>
      ` : ''}
      <hr style="margin: 20px 0;" />
      <p><em>This lead came from your ${formSource} contact form.</em></p>
    `;

    // Send email to business owner with lead information
    const data = await resend.emails.send({
      from: fromEmail,
      to: ['Khamareclarke@gmail.com'], // Send to your business email
      subject: subject || 'New Business Bundle Inquiry',
      replyTo: email, // Allow replying directly to the customer
      html: htmlContent,
    });
    console.log('Email sent successfully:', data);
    return NextResponse.json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Email send error:', error);
    return NextResponse.json({ 
      error: `Email sending failed: ${error.message}` 
    }, { status: 500 });
  }
}
