'use client';

import React, { useState, useCallback } from "react";
import Image from "next/image";
import CTAButton from "./CTAButton";

/**
 * The site's one enquiry form.
 *
 * Extracted from EmailSection so the homepage and /business-bundle render the SAME
 * component rather than two lookalikes. Every default below is the homepage's own
 * value, so `<EnquiryForm />` reproduces the homepage's markup exactly.
 *
 * THE SUBMIT CONTROL, and why `useBookingWidget={false}` matters. The homepage's
 * button used to be `<CTAButton type="submit">` with CTAButton's default
 * `useBookingWidget={true}`, which routes through BookingButton and renders an ANCHOR
 * to the booking widget instead of a submit button. That left the form with no submit
 * control at all: clicking opened the booking modal, and Enter did nothing, because
 * implicit submission only applies to a form with one field and no submit button. The
 * form therefore captured nothing. `useBookingWidget={false}` renders a genuine
 * `<button type="submit">` with the identical className, so the appearance is
 * unchanged and the form actually submits.
 *
 * ATTRIBUTION. `source` is NOT sent to the server as a trusted field. /api/send
 * derives the stored source itself — `businessType ? 'business-bundle' : 'contact'` —
 * so this component does nothing more than include the businessType value the visitor
 * chose. Server-side derivation stays in charge; a client cannot assert its own source.
 */

const trackEvent = (category, action, label) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label
    });
  }
};

const FIELD_CLASS =
  "w-full px-4 py-3 text-gray-100 bg-surface border border-white/10 rounded-lg focus:border-primary focus:outline-none transition-colors placeholder-[#ADB7BE]";

export default function EnquiryForm({
  source = "contact",
  showHeader = true,
  heading = "Book a Consultation",
  intro = "Fill out the form below to share details of your operation.",
  footerText = "No obligation. Free audit.",
  submitLabel = "Send Request",
  eventLabel = "contact_submit_form",
  successTitle = "Request sent",
  successBody = "I'll get back to you within 24 hours with next steps.",
}) {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const needsBusinessType = source === "business-bundle";

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    // Duplicate-submission guard: the button is disabled while in flight, and this
    // stops a second Enter keypress landing before state has updated.
    if (submitting || submitted) return;
    setSubmitting(true);

    const form = e.target;
    const formData = new FormData(form);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone') || '',
      subject: formData.get('subject'),
      message: formData.get('message'),
    };
    if (needsBusinessType) {
      data.businessType = formData.get('businessType') || '';
    }

    trackEvent('contact', 'submit_consultation', needsBusinessType ? 'business_bundle_form' : 'consultation_form');

    try {
      const response = await fetch('/api/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSubmitted(true);
        form.reset();
        trackEvent('contact', 'consultation_success', needsBusinessType ? 'business_bundle_form_success' : 'consultation_form_success');
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || 'Failed to send message');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      trackEvent('contact', 'consultation_error', 'consultation_form_error');
      alert(`Failed to send request: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  }, [submitting, submitted, needsBusinessType]);

  if (submitted) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-white mb-2">{successTitle}</h3>
        <p className="text-[#ADB7BE]">{successBody}</p>
      </div>
    );
  }

  return (
    <>
      {showHeader ? (
        <div className="mb-6">
          <div className="flex justify-center mb-4">
            <Image
              src="/images/contactimage.png.png"
              alt="Khamare Clarke"
              width={80}
              height={80}
              className="object-cover rounded-lg border border-white/10"
              priority
            />
          </div>
          <h3 className="reveal text-lg font-bold text-white mb-2 text-center">{heading}</h3>
          <p className="reveal text-[#ADB7BE] text-base text-center">{intro}</p>
        </div>
      ) : null}

      <form className="reveal space-y-4" style={{ "--rv-delay": "200ms" }} onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <input
              name="name"
              type="text"
              id="name"
              required
              aria-label="Your Name"
              className={FIELD_CLASS}
              placeholder="Your Name"
            />
          </div>
          <div>
            <input
              name="email"
              type="email"
              id="email"
              required
              aria-label="Your Email Address"
              className={FIELD_CLASS}
              placeholder="you@email.com"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <input
              name="phone"
              type="tel"
              id="phone"
              aria-label="Your Phone Number (Optional)"
              className={FIELD_CLASS}
              placeholder="Phone (optional)"
            />
          </div>
          <div>
            <input
              name="subject"
              type="text"
              id="subject"
              required
              aria-label="Nature of the Enquiry"
              className={FIELD_CLASS}
              placeholder="Nature of the enquiry"
            />
          </div>
        </div>

        {/* Only the bundle carries this field. Its value is what /api/send uses to
            attribute the lead server-side. */}
        {needsBusinessType ? (
          <div>
            <select
              name="businessType"
              id="businessType"
              required
              aria-label="Business type"
              className={FIELD_CLASS}
              defaultValue=""
            >
              <option value="" disabled>Select business type</option>
              <option value="local">Local Service</option>
              <option value="ecommerce">E-commerce</option>
              <option value="agency">Agency</option>
              <option value="saas">SaaS</option>
              <option value="other">Other</option>
            </select>
          </div>
        ) : null}

        <div>
          <textarea
            name="message"
            id="message"
            rows="4"
            required
            aria-label="Where the organisation is under pressure"
            className={`${FIELD_CLASS} resize-none`}
            placeholder="Tell me where the organisation is under pressure."
          />
        </div>

        <CTAButton
          type="submit"
          fullWidth
          useBookingWidget={false}
          disabled={submitting}
          eventLabel={eventLabel}
        >
          {submitting ? 'Sending…' : submitLabel}
        </CTAButton>

        <div className="text-center pt-2">
          <p className="gold-text text-lg">{footerText}</p>
        </div>
      </form>
    </>
  );
}
