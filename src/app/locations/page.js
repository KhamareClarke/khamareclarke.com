import Link from "next/link";
import PageShell from "../components/PageShell";
import PageHero from "../components/ui/PageHero";
import AchievementsSection from "../components/AchievementsSection";
import SectionHeading from "../components/ui/SectionHeading";
import CtaPanel from "../components/ui/CtaPanel";
import { Section } from "../components/ui/Section";
import { Container } from "../components/ui/Container";
import Card from "../components/ui/Card";
import CTAButton from "../components/CTAButton";
import { TIER_1_LOCATIONS, TIER_2_LOCATIONS, TIER_3_LOCATIONS, SERVICES } from "../../lib/services-data";
import { PERSON_SCHEMA, PROFESSIONAL_SERVICE_SCHEMA } from "../../lib/schema";

// Metadata untouched — a design change must never move a page's search identity.
export const metadata = {
  title: "SEO and AI Services by Location | Khamare Clarke — UK Coverage",
  description: "AI Implementation Specialist serving the whole of the UK from Stoke-on-Trent, Staffordshire. SEO, AI search optimisation, web development, AI agents, and digital marketing for businesses across England.",
  alternates: { canonical: "https://khamareclarke.com/locations" },
  openGraph: {
    title: "SEO and AI Services by Location | Khamare Clarke",
    description: "AI Implementation Specialist serving the UK from Stoke-on-Trent. SEO, AI search, web development, AI agents, digital marketing.",
    url: "https://khamareclarke.com/locations",
    siteName: "Khamare Clarke",
    locale: "en_GB",
    type: "website",
  },
};

/* The location chips and the service links inside a location card are the same idea
   twice, so they are one class string each rather than two near-identical ones. The
   fill and border come from the homepage's card vocabulary (surface-muted, white/10);
   the previous gradient fill was a second card colour the rest of the site did not use.

   The service links are gold-text, so their hover CANNOT be a colour change: gold-text
   paints with the background image clipped to the glyphs and sets the text fill
   transparent, and that transparent fill wins over `color` no matter how specific the
   hover rule is. The affordance is an underline instead, which is visible because
   globals.css gives .gold-text a text-decoration-color of #ffb700. */
const chipClass =
  "block bg-surface-muted border border-white/10 hover:border-primary/40 rounded-lg px-4 py-3 text-muted hover:gold-text text-sm transition-colors";
const serviceLinkClass =
  "gold-text hover:underline text-xs transition-colors flex items-center gap-1";

export default function LocationsPage() {
  return (
    <PageShell
      schema={
        <>
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(PERSON_SCHEMA) }} />
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(PROFESSIONAL_SERVICE_SCHEMA) }} />
        </>
      }
    >
      <Section className="mt-0 pb-ds-4 page-top">
        <Container size="narrow">
          <PageHero
            eyebrow="Coverage"
            size="compact"
            title={
              <>
                SEO and AI Services <span className="gold-text">Across the UK</span>
              </>
            }
            lede="Based in Stoke-on-Trent, Staffordshire. Serving businesses across England and the whole of the United Kingdom remotely. In-person available across Staffordshire, Cheshire, the West Midlands, and Greater Manchester."
          />

          {/* The trust strip that sits under the hero on the homepage. */}
          <AchievementsSection />

          <hr aria-hidden="true" className="section-sep mt-16" />

          {/* Primary locations */}
          <section className="mt-16" aria-labelledby="primary-heading">
            <SectionHeading id="primary-heading">
              Primary <span className="gold-text">service areas</span>
            </SectionHeading>
            <div className="grid sm:grid-cols-2 gap-4">
              {TIER_1_LOCATIONS.map((location, index) => (
                <Card
                  key={location.slug}
                  className="reveal"
                  style={{ "--rv-delay": `${Math.min(index, 6) * 90}ms` }}
                >
                  <h3 className="text-white font-bold text-lg mb-2">{location.name}</h3>
                  <p className="text-muted text-sm leading-relaxed mb-4">{location.intro}</p>
                  <ul className="space-y-1">
                    {SERVICES.slice(0, 4).map((service) => (
                      <li key={service.slug}>
                        <Link href={`/services/${service.slug}/${location.slug}`} className={serviceLinkClass}>
                          <span aria-hidden="true">→</span> {service.shortTitle}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>
          </section>

          <hr aria-hidden="true" className="section-sep mt-16" />

          {/* Extended UK coverage */}
          <section className="mt-16" aria-labelledby="extended-heading">
            <SectionHeading id="extended-heading">
              Extended <span className="gold-text">UK coverage</span>
            </SectionHeading>
            <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {TIER_2_LOCATIONS.map((location, index) => (
                <li key={location.slug} className="reveal" style={{ "--rv-delay": `${Math.min(index, 6) * 70}ms` }}>
                  <Link href={`/services/seo-local-seo/${location.slug}`} className={chipClass}>
                    {location.name}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <hr aria-hidden="true" className="section-sep mt-16" />

          {/* Staffordshire and Cheshire towns */}
          <section className="mt-16" aria-labelledby="local-heading">
            <SectionHeading id="local-heading">
              Staffordshire and <span className="gold-text">Cheshire</span>
            </SectionHeading>
            <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {TIER_3_LOCATIONS.map((location, index) => (
                <li key={location.slug} className="reveal" style={{ "--rv-delay": `${Math.min(index, 6) * 70}ms` }}>
                  <Link href={`/services/seo-local-seo/${location.slug}`} className={chipClass}>
                    {location.name}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <hr aria-hidden="true" className="section-sep mt-16" />

          {/* About the service area */}
          <section className="mt-16" aria-labelledby="area-note">
            <SectionHeading id="area-note">
              How remote <span className="gold-text">service delivery</span> works
            </SectionHeading>
            <div className="space-y-5 text-muted text-lg leading-relaxed">
              <p className="reveal" style={{ "--rv-delay": "200ms" }}>
                All campaign work — audits, technical SEO, content strategy, Google Business Profile management, AI system setup — is delivered remotely. That means a business in London, Leeds, or Liverpool gets the same quality of work as one in Stoke-on-Trent. There is no geographic discount on quality.
              </p>
              <p className="reveal" style={{ "--rv-delay": "280ms" }}>
                Reporting happens monthly via a plain-English update: what was done, where the rankings moved, what is planned next. No dashboards to interpret. For clients who want to meet, video calls are the default. In-person visits are available for Staffordshire, Cheshire, West Midlands, and Greater Manchester clients where that adds value.
              </p>
            </div>
          </section>

          {/* CTA */}
          <CtaPanel
            className="mt-20"
            headingLevel="h2"
            heading={
              <>
                Not sure if your <span className="gold-text">area is covered?</span>
              </>
            }
            body="Every UK business is in scope. Book a free 30-minute call to discuss your situation specifically."
          >
            <CTAButton eventLabel="locations_hub_cta" caption="What works where you are.">
              Book a Consultation
            </CTAButton>
          </CtaPanel>
        </Container>
      </Section>
    </PageShell>
  );
}
