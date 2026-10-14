import AchievementsSection from "../components/AchievementsSection";
import CTAButton from "../components/CTAButton";
import HeroSection from "../components/HeroSection";
import OfferCard from "../components/OfferCard";
import PageShell from "../components/PageShell";
import CtaPanel from "../components/ui/CtaPanel";
import { Section } from "../components/ui/Section";
import { Container } from "../components/ui/Container";

/*
 * METADATA — exported from the page, not a services/layout.js.
 *
 * A layout would be inherited by /services/[service] and /services/[service]/[location].
 * Both define their own generateMetadata but neither sets `alternates`, so a canonical
 * declared in a layout would have been applied to all 299 location pages.
 *
 * This page previously had no metadata of its own and so published the ROOT title —
 * "Khamare Clarke | AI Implementation Specialist" — the same <title> as the homepage.
 */
export const metadata = {
  title: "Practical Use of AI for UK Businesses | Khamare Clarke",
  description:
    "I assess how a business operates, find where time and capacity are being lost, and work out where AI is genuinely the right answer. Then I implement it, train the staff and stay on the systems.",
  alternates: { canonical: "/services" },
  openGraph: {
    title: "Practical Use of AI for UK Businesses | Khamare Clarke",
    description:
      "I assess how a business operates, find where time and capacity are being lost, and work out where AI is genuinely the right answer. Then I implement it, train the staff and stay on the systems.",
    url: "https://khamareclarke.com/services",
    siteName: "Khamare Clarke",
    images: [
      {
        url: "/images/about-image.png",
        width: 1200,
        height: 630,
        alt: "Khamare Clarke | AI Implementation Specialist",
      },
    ],
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Practical Use of AI for UK Businesses | Khamare Clarke",
    description:
      "I assess how a business operates, find where time and capacity are being lost, and work out where AI is genuinely the right answer. Then I implement it, train the staff and stay on the systems.",
    creator: "@khamareclarke",
    images: ["/images/about-image.png"],
  },
};

/*
 * The pillars and the assurance lines are no longer defined on this page. They moved to
 * lib/offer-data.js, which is now the single source for the offer on every page that
 * renders the card. The wording that used to sit here IS that file's wording — this page's
 * copy was the approved version — so nothing on this page reads differently.
 *
 * What did change is the other two pages: the homepage and /business-bundle used to carry a
 * different set of pillars and a different assurance block, including a security line that
 * named a certification the repository could not evidence. They now read what this page
 * reads. See the note at the top of lib/offer-data.js.
 */

/*
 * REMOVED at Master Clarke's instruction: the assessment, where AI fits,
 * the fit rules, the outcomes, implementation, support, training and the compliance
 * controls. Five module-level arrays went with them — ASSESSMENT_AREAS, OPPORTUNITIES,
 * FIT_RULES, OUTCOMES and CONTROLS.
 *
 * The copy was not thrown away. It is archived in plain text, and the page file as it stood
 * before the change, at:
 *   /home/khamare/khamareclarke-services-removal-20261014/
 *
 * What those sections explained is now carried by the two hero lines above: the audit that
 * finds where a business is losing capacity, and the implementation done securely with GDPR
 * and cybersecurity considered throughout.
 */

export default function ServicesPage() {
  return (
    <PageShell>
      <Section className="mt-0 pb-ds-4 page-top">
        <Container size="main">

          {/* 1 · Hero. The homepage's own hero component, so the two cannot drift. Only the
              words are overridden; the grid, spacing, type scale, eyebrow rules, CTA and
              portrait are the homepage's, inherited unchanged. */}
          <HeroSection
            eyebrow="Services"
            title={
              <>
                Practical Use of <span className="gold-text">AI</span>
              </>
            }
            subtitle="A structured audit reveals where a business is losing capacity."
            lede="From there, AI is implemented where it makes sense, with staff training, GDPR and cybersecurity considered throughout."
            ctaCaption="Free 30-minute introductory call. No obligation."
            eventLabel="services_consultation_cta"
          />

          {/* The homepage's own section, the one that sits directly under its hero. */}
          <AchievementsSection />

          <hr aria-hidden="true" className="section-sep mt-16" />

          {/* 2 · The homepage's "Khamare Clarke" section, standing in for the block that
              used to run here.

              The heading and the paragraph are the homepage's own, word for word. Its
              portrait and its CTA are deliberately NOT copied: the hero immediately above
              already carries a portrait and a CTA, and a second pair a few hundred pixels
              lower would read as a mistake rather than a choice. If he wants them here as
              well, they are the two blocks in app/page.js either side of this paragraph.

              The price card below is kept, because it was not part of the copy he asked me to
              remove. The "Managed Business Systems" heading and the intro line that used to
              sit above it were, so the card now stands on its own label. */}
          <section className="mt-16">
            {/* Presentation put back as it was: centred, with the homepage's own ds-lede
                paragraph. The layout rewrite that was here has been reverted.

                The wording is reworded to carry the theme the hero and the offer carry on
                this page: an audit first, then the build, the training, and the systems that
                are managed afterwards, with security and data protection part of the work.
                The credentials in it — twelve years, AI Solution Architect, Google Cloud
                Engineer, training AI models — are his and are unchanged.

                This is the /services copy only. The homepage's own section still carries the
                original wording. */}
            <div className="mb-10 text-center">
              <h2 className="reveal ds-heading-2 text-white mb-4" style={{ "--rv-delay": "120ms" }}>
                Khamare <span className="gold-text">Clarke</span>
              </h2>

              <p className="reveal ds-lede text-[#ADB7BE] mx-auto" style={{ "--rv-delay": "200ms" }}>
                Twelve years in software engineering, artificial intelligence and machine
                learning. I have worked as an AI Solution Architect and a Google Cloud
                Engineer, and I train AI models. I apply the same approach to SMEs. It starts
                with an audit: where time is lost, where enquiries go missing, and which
                systems are causing the problem. Then I build the systems that fix it, train
                the staff who use them, and stay on to manage and improve them. Security and
                data protection shape the build rather than being checked at the end.
              </p>
            </div>

            <div className="mt-16">
              {/* No pillars or assurance passed: they come from lib/offer-data.js, so this
                  card is the same card the homepage renders. `outcome={null}` stays, because
                  this page deliberately omits the card's closing line. */}
              <OfferCard
                eventLabel="services_offer_cta"
                ctaCaption="Free 30-minute introductory call. No obligation."
                outcome={null}
              />
            </div>

          </section>

          {/* REMOVED at Master Clarke's instruction: the paragraph that sat under the offer
              card explaining what the £999 covers, and the whole Credentials section — its
              heading and the three qualifications. The hairline rule that separated
              credentials from the offer went with them, so the offer now runs straight into
              the closing panel.

              The qualifications still appear elsewhere on the site, so removing the list
              here does not take them off the site: the shared footer prints the masters
              line on every page, the homepage trust strip carries its own shorter version
              of it, and the structured data declares all three. Only this page changed. */}

          <CtaPanel
            className="mt-20"
            headingLevel="h2"
            heading={
              <>
                Tell me how the business <span className="gold-text">runs.</span>
              </>
            }
            body="Thirty minutes on a call. I will tell you what I would look at first, and where AI would and would not help."
          >
            <CTAButton
              eventLabel="services_consultation_cta"
              caption="Free 30-minute introductory call. No obligation."
            >
              Book a Call
            </CTAButton>
          </CtaPanel>

        </Container>
      </Section>
    </PageShell>
  );
}
