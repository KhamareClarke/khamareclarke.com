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
 * What the Managed Business Systems offer covers, as structured data states it.
 *
 * Read by lib/schema.js (the ProfessionalService offer catalogue) and by
 * app/business-bundle/layout.js (that page's Service node). Both files previously held their
 * own literal copy of this sentence; holding it once means the two can never drift apart,
 * while the wording itself is untouched.
 *
 * THIS SENTENCE IS THE ORIGINAL, VERBATIM. It was briefly replaced with a reworded version
 * built from the four card pillars; that replacement is reverted, because rewording it
 * changed the commercial scope the offer is advertised as covering, and scope changes need
 * the client's explicit authorisation rather than a tidy-up.
 *
 * The four pillars on the card ARE A SUMMARY OF THE OFFER, NOT AN EXHAUSTIVE LIST of what is
 * included. So a service named here and absent from the pillars is not thereby excluded —
 * Google and Meta Ads management is the live example. Do not "reconcile" the two by deleting
 * anything from this string.
 *
 * If this text ever needs to change, that is a commercial decision: ask first.
 */
export const OFFER_SCHEMA_DESCRIPTION =
  "One managed service covering website development, technical and local SEO, Google Business Profile optimisation, AI search visibility, enquiry capture, CRM integration, follow-up automation, workflow automation and reporting.";

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
