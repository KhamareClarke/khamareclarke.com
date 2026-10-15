import React from "react";
import EnquiryForm from "./EnquiryForm";
import { Container } from "./ui/Container";
import { Section } from "./ui/Section";
import SectionHeading from "./ui/SectionHeading";

/**
 * The enquiry block every marketing page now carries.
 *
 * PageShell renders this by default, so the unified form appears site-wide from one
 * place rather than being pasted into 30-odd page files. Pages that already render their
 * own form — the homepage via EmailSection, /business-bundle with its own attribution —
 * suppress it with `showEnquiryForm={false}`.
 *
 * source="contact": /api/send files a lead as 'contact' when there is no businessType,
 * which is what a general page enquiry is. /business-bundle supplies the businessType
 * field instead, so its leads still file as 'business-bundle'.
 *
 * The footer line is the neutral one. The homepage's own form keeps its older
 * "No obligation. Free audit." default, so the homepage is untouched; that promise is
 * not spread across the rest of the site.
 */
export default function EnquirySection() {
  return (
    <Section id="enquire" aria-labelledby="enquiry-heading" className="mt-0 pb-ds-4">
      <Container size="narrow">
        <SectionHeading
          id="enquiry-heading"
          align="center"
          lede="Tell me about the business and I will come back to you."
        >
          Send an <span className="gold-text">enquiry</span>
        </SectionHeading>

        <div className="bg-surface-muted border border-white/10 rounded-lg p-5 sm:p-8 max-w-2xl mx-auto">
          <EnquiryForm
            showHeader={false}
            footerText="Free 30-minute introductory call. No obligation."
          />
        </div>
      </Container>
    </Section>
  );
}
