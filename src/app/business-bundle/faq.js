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
 * asserted here.
 *
 * ADVERTISING, updated: the "What costs extra?" answer now states that Google and Meta Ads
 * management is part of the monthly managed service and that only advertising spend is paid
 * separately. It previously said advertising spend and third-party costs were separate,
 * which under a heading about extra costs read as though advertising work itself cost more.
 */
export const BUNDLE_FAQ = [
  {
    question: "What is included?",
    answer:
      "Website development and improvement, technical and local SEO, Google Business Profile optimisation, AI search visibility, enquiry forms, CRM integration, lead qualification, follow-up automation, appointment booking, workflow automation across the tools you already use, and reporting on enquiries, response times and search visibility.",
  },
  {
    question: "What costs extra?",
    // The client's wording, verbatim. It replaces an answer that said only
    // that bespoke work and advertising spend were separate, which sat under a heading about
    // extra costs while the offer card said Ads management runs inside the system — a reader
    // could reasonably have concluded that advertising work cost more. Ads management is now
    // stated as included, and only spend is separate. Do not reword: this answer is the one
    // that draws the line, and it feeds both the visible accordion and the FAQPage schema.
    answer:
      "Google and Meta Ads management is part of the £999/month managed service. Advertising spend is paid separately. Bespoke software projects and third-party costs are scoped and agreed separately.",
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
