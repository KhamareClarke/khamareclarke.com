/**
 * Single source of truth for the Managed Business Systems FAQs.
 *
 * The visible accordion (business-bundle/page.js) and the FAQPage structured data
 * (business-bundle/layout.js) both read from here, so the markup Google receives can
 * never drift from what a visitor reads. This mirrors the homepage's arrangement in
 * src/lib/faq-data.js.
 *
 * WHAT WAS REMOVED, and why: this array previously stated a 7-day delivery, a 14-day
 * revision window, 30 days of after-launch support, a fixed fee for extra pages, and
 * that the client owns the site, content and domain. None of those are approved
 * commitments for the £999/month managed service — the delivery, revision, hosting,
 * ownership and cancellation terms are still to be decided. They are therefore not
 * asserted here. Advertising is now described the same way the page's exclusions
 * section describes it.
 */
export const BUNDLE_FAQ = [
  {
    question: "What is included?",
    answer:
      "Website development and improvement, technical and local SEO, Google Business Profile optimisation, AI search visibility, enquiry forms, CRM integration, lead qualification, follow-up automation, appointment booking, workflow automation across the tools you already use, and reporting on enquiries, response times and search visibility.",
  },
  {
    question: "What costs extra?",
    answer:
      "Bespoke software projects are scoped and quoted separately. Advertising spend and third-party costs are agreed separately.",
  },
  {
    question: "Who does the work?",
    answer:
      "I handle the technical implementation and ongoing management, with agreed priorities, clear documentation and regular reporting.",
  },
  {
    question: "What happens first?",
    answer:
      "A free 30-minute introductory call. We agree the priorities and the work to be delivered before anything begins.",
  },
];
