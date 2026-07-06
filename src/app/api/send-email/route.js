import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { supabase, hasSupabase, pushLeadToEmpire } from '@/lib/supabase';

export async function POST(request) {
  try {
    const { name, email, phone, message, type, company, budget, timeline } = await request.json();

    if (hasSupabase()) {
      try {
        await supabase.from('form_submissions').insert({
          source: type || 'contact-form',
          data: { name, email, phone, message, company, budget, timeline },
          created_at: new Date().toISOString(),
        });
      } catch (_) {}
    }

    // Push lead to Empire dashboard (central empire_leads)
    try {
      await pushLeadToEmpire({
        source: type || 'contact-form',
        email: email || null,
        name: name || null,
        payload: { phone, message, company, budget, timeline },
      });
    } catch (_) {}

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Email content
    const emailContent = `
New ${type || 'Contact'} Request from Website

Contact Details:
- Name: ${name || 'Not provided'}
- Email: ${email || 'Not provided'}
- Phone: ${phone || 'Not provided'}
- Company: ${company || 'Not provided'}

Project Details:
- Budget: ${budget || 'Not specified'}
- Timeline: ${timeline || 'Not specified'}

Message:
${message || 'No message provided'}

---
Sent from khamareclarke.com chatbot
Time: ${new Date().toLocaleString()}
    `;

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER || 'khamareclarke@gmail.com',
      to: 'khamareclarke@gmail.com',
      subject: `New ${type || 'Contact'} Request - ${name || 'Anonymous'}`,
      text: emailContent,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #ffb700;">New ${type || 'Contact'} Request from Website</h2>
          
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Contact Details:</h3>
            <p><strong>Name:</strong> ${name || 'Not provided'}</p>
            <p><strong>Email:</strong> ${email || 'Not provided'}</p>
            <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
            <p><strong>Company:</strong> ${company || 'Not provided'}</p>
          </div>

          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Project Details:</h3>
            <p><strong>Budget:</strong> ${budget || 'Not specified'}</p>
            <p><strong>Timeline:</strong> ${timeline || 'Not specified'}</p>
          </div>

          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Message:</h3>
            <p style="white-space: pre-wrap;">${message || 'No message provided'}</p>
          </div>

          <hr style="margin: 30px 0;">
          <p style="color: #666; font-size: 12px;">
            Sent from khamareclarke.com chatbot<br>
            Time: ${new Date().toLocaleString()}
          </p>
        </div>
      `
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ 
      success: true, 
      message: 'Email sent successfully!' 
    });

  } catch (error) {
    console.error('Email sending error:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
