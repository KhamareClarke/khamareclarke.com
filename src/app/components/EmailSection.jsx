'use client';

import React from "react";
import EnquiryForm from "./EnquiryForm";

/**
 * The homepage's enquiry section.
 *
 * The form itself now lives in components/EnquiryForm.jsx, which is shared with
 * /business-bundle. This component renders it with no props, so every default in
 * EnquiryForm applies and the homepage's markup is unchanged — with one deliberate
 * exception: the submit control is now a real `<button type="submit">` rather than the
 * booking-widget anchor it used to be, which is what made the form functional again.
 *
 * The section, its heading, its lede and the card wrapper are untouched.
 */
const EmailSection = () => {
  return (
    <section id="contact" className="py-16 md:py-20 lg:py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="mb-12 text-center">
          <h2 className="reveal ds-heading-2 text-white mb-4" style={{ "--rv-delay": "120ms" }}>
            Book a Consultation
          </h2>
          <p className="reveal ds-lede gold-text mx-auto" style={{ "--rv-delay": "200ms" }}>
            Let's identify what's broken and the data-driven solution.
          </p>
        </div>

        {/* Main Content - Horizontal Layout */}
        <div className="grid grid-cols-1 max-w-2xl mx-auto">

          {/* Right: Contact Form */}
          <div className="bg-surface-muted border border-white/10 rounded-lg p-8">
            <EnquiryForm />
          </div>

        </div>
      </div>
    </section>
  );
};

export default EmailSection;
