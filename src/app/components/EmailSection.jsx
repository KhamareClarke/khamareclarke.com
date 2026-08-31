'use client';

import React, { useState, useCallback } from "react";
import Image from "next/image";
import { Badge } from "./ui/Badge";
import CTAButton from "./CTAButton";

const trackEvent = (category, action, label) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label
    });
  }
};

const EmailSection = () => {
  const [emailSubmitted, setEmailSubmitted] = useState(false);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone') || '',
      subject: formData.get('subject'),
      message: formData.get('message'),
    };

    trackEvent('contact', 'submit_consultation', 'consultation_form');

    try {
      const response = await fetch('/api/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setEmailSubmitted(true);
        form.reset();
        trackEvent('contact', 'consultation_success', 'consultation_form_success');
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      trackEvent('contact', 'consultation_error', 'consultation_form_error');
      alert(`Failed to send request: ${error.message}`);
    }
  }, []);

  return (
    <section id="contact" className="my-12 py-16 relative">
      <div className="max-w-6xl mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="mb-12 text-center">
          <Badge variant="outline" className="mb-6">Consultation</Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-4 leading-tight">
            Book a Consultation
          </h2>
          <p className="text-[#ADB7BE] text-lg max-w-2xl mx-auto leading-relaxed">
            Let's identify what's broken and the data-driven solution.
          </p>
        </div>

        {/* Main Content - Horizontal Layout */}
        <div className="grid grid-cols-1 max-w-2xl mx-auto">

          {/* Right: Contact Form */}
          <div className="bg-surface-muted border border-white/10 rounded-lg p-8">
            {emailSubmitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Request sent</h3>
                <p className="text-[#ADB7BE]">I'll get back to you within 24 hours with next steps.</p>
              </div>
            ) : (
              <>
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
                  <h3 className="text-2xl font-bold text-white mb-2 text-center">Book a Consultation</h3>
                  <p className="text-[#ADB7BE] text-sm text-center">Fill out the form below to share details of your operation.</p>
                </div>

                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <input
                        name="name"
                        type="text"
                        id="name"
                        required
                        aria-label="Your Name"
                        className="w-full px-4 py-3 text-gray-100 bg-surface border border-white/10 rounded-lg focus:border-primary focus:outline-none transition-colors placeholder-[#ADB7BE]"
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
                        className="w-full px-4 py-3 text-gray-100 bg-surface border border-white/10 rounded-lg focus:border-primary focus:outline-none transition-colors placeholder-[#ADB7BE]"
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
                        className="w-full px-4 py-3 text-gray-100 bg-surface border border-white/10 rounded-lg focus:border-primary focus:outline-none transition-colors placeholder-[#ADB7BE]"
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
                        className="w-full px-4 py-3 text-gray-100 bg-surface border border-white/10 rounded-lg focus:border-primary focus:outline-none transition-colors placeholder-[#ADB7BE]"
                        placeholder="Nature of the enquiry"
                      />
                    </div>
                  </div>

                  <div>
                    <textarea
                      name="message"
                      id="message"
                      rows="4"
                      required
                      aria-label="Where the organisation is under pressure"
                      className="w-full px-4 py-3 text-gray-100 bg-surface border border-white/10 rounded-lg focus:border-primary focus:outline-none transition-colors placeholder-[#ADB7BE] resize-none"
                      placeholder="Tell me where the organisation is under pressure."
                    />
                  </div>

                  <CTAButton type="submit" fullWidth eventLabel="contact_submit_form">
                    Send Request
                  </CTAButton>

                  <div className="text-center pt-2">
                    <p className="text-[#ADB7BE] text-xs">No obligation.</p>
                  </div>
                </form>
              </>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};

export default EmailSection;
