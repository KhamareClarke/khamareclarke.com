/*
 * The offer, in one place.
 *
 * The four pillars and the three assurance lines below are the approved wording for the
 * Managed Business Systems offer. They used to exist twice — one set inside
 * components/OfferCard.jsx and a second passed in as props by app/services/page.js — which
 * meant the homepage and /services described the same price with different words. The
 * Services-page wording is the approved one and is now the only copy in the repository.
 *
 * Every page that renders the card reads from here: the homepage (through
 * components/PricingSection.jsx), /services and /business-bundle. Editing this file changes
 * all three at once, which is the point.
 *
 * LOCKED. Do not reword without the client's agreement. This text carries the price.
 *
 * A note for whoever comes next: the assurance lines that used to sit in OfferCard.jsx
 * asserted a security certification and a data-protection regulation by name, and the
 * repository held no evidence for either. BUILD-STANDARD section 4 is the rule that applies,
 * and section 4.3 lists what may never appear. The wording here states what is done during a
 * build rather than what the business holds, which is both checkable and more useful to a
 * reader. If you are considering restoring the older lines, read section 4 first.
 */

export const OFFER_PILLARS = [
  {
    no: "01",
    title: "Get Found",
    body: "Website infrastructure, technical and local SEO and relevant AI search visibility.",
  },
  {
    no: "02",
    title: "Capture Enquiries",
    body: "Enquiry capture, CRM connections and appropriate follow-up automation.",
  },
  {
    no: "03",
    title: "Connect Operations",
    body: "Agreed integrations and workflows that reduce repetitive work.",
  },
  {
    no: "04",
    title: "Manage and Improve",
    body: "Monitoring, maintenance, reporting and continuous improvement within scope.",
  },
];

/*
 * The offer as structured data describes it.
 *
 * Read by lib/schema.js (the ProfessionalService offer catalogue) and by
 * app/business-bundle/layout.js (that page's Service node). Both used to carry their own copy
 * of a nine-deliverable sentence, and the two had drifted from the card.
 *
 * This is the four pillars' own wording, in the pillars' order, and nothing else. It
 * deliberately does not claim website development, custom applications or complex
 * integrations as included in the monthly fee: pillar 01 says "website infrastructure", and
 * pillar 03 says "agreed integrations", which is a scoped commitment rather than an open one.
 * A bespoke build belongs to the separate offer in the same catalogue.
 *
 * COMPLIANCE NOTE: pillar 01 names Google Business Profile optimisation. That is kept because
 * removing it would narrow what the fee is advertised as covering, which is a commercial
 * decision rather than a tidy-up. Google Ads is deliberately absent here — it is a capability
 * of the business, listed in the ProfessionalService serviceType and the Person knowsAbout,
 * not part of this monthly offer.
 */
export const OFFER_SCHEMA_DESCRIPTION =
  "One managed service across four areas. Get found: website infrastructure, technical and " +
  "local SEO, Google Business Profile optimisation and AI search visibility. Capture " +
  "enquiries: enquiry capture, CRM connections and follow-up automation. Connect operations: " +
  "agreed integrations and workflows that reduce repetitive work. Manage and improve: " +
  "monitoring, maintenance, reporting and continuous improvement within scope.";

export const OFFER_ASSURANCE = [
  {
    label: "Security",
    body: "Considered from the assessment onward: access controls, data minimisation, secrets held outside the codebase.",
  },
  {
    label: "Documentation",
    body: "Every part of the build recorded step by step, so you always know what has been done and what it covers.",
  },
  {
    label: "Direct support",
    body: "From me, as it runs. No ticket queue.",
  },
];
