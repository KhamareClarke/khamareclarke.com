import Link from "next/link";
import { notFound } from "next/navigation";
import PageShell from "../../components/PageShell";
import PageHero from "../../components/ui/PageHero";
import AchievementsSection from "../../components/AchievementsSection";
import SectionHeading from "../../components/ui/SectionHeading";
import CtaPanel from "../../components/ui/CtaPanel";
import { Section } from "../../components/ui/Section";
import { Container } from "../../components/ui/Container";
import Card from "../../components/ui/Card";
import CTAButton from "../../components/CTAButton";
import { SERVICES, TIER_1_LOCATIONS, ALL_LOCATIONS } from "../../../lib/services-data";

export async function generateStaticParams() {
  return SERVICES.map(service => ({ service: service.slug }));
}

export async function generateMetadata({ params }) {
  const service = SERVICES.find(s => s.slug === params.service);
  if (!service) return {};

  return {
    title: `${service.title} | Khamare Clarke — UK Specialist`,
    description: `${service.heading}: ${service.description} Based in Stoke-on-Trent, serving the whole of the UK.`,
    alternates: {
      canonical: `https://khamareclarke.com/services/${service.slug}`,
    },
    openGraph: {
      title: `${service.title} | Khamare Clarke`,
      description: `${service.heading}: ${service.description}`,
      url: `https://khamareclarke.com/services/${service.slug}`,
      siteName: "Khamare Clarke",
      locale: "en_GB",
      type: "article",
    },
  };
}

const documentedResults = [
  {
    client: "Upgrade Roofing Solutions",
    metric: "538%",
    body: "Growth in Google Business Profile interactions in 90 days. Over 30 qualified inbound calls in the first two weeks.",
  },
  {
    client: "City Plaza Abu Dhabi",
    metric: "5X",
    body: "Lead volume within 60 days, scaling to approximately 20 qualified enquiries per day at peak.",
  },
];

export default function ServiceHubPage({ params }) {
  const service = SERVICES.find(s => s.slug === params.service);
  if (!service) notFound();

  const otherServices = SERVICES.filter(s => s.slug !== service.slug);

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": service.title,
    "serviceType": service.title,
    "description": service.description,
    "provider": { "@id": "https://khamareclarke.com/#business" },
    "areaServed": { "@type": "Country", "name": "United Kingdom" },
    "url": `https://khamareclarke.com/services/${service.slug}`,
  };

  return (
    <PageShell
      schema={
        <>
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
        </>
      }
    >
      <Section className="mt-0 pb-ds-4 page-top">
        <Container size="narrow">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-muted mb-8" aria-label="Breadcrumb">
          <Link href="/" className="hover:gold-text transition-colors">Home</Link>
          <span>/</span>
          <Link href="/services" className="hover:gold-text transition-colors">Services</Link>
          <span>/</span>
          <span className="text-white">{service.shortTitle}</span>
        </nav>

        <PageHero eyebrow="Service" title={service.heading} size="compact" />

        {/* The trust strip that sits under the hero on the homepage. */}
        <AchievementsSection />
        <p className="reveal mt-6 text-muted text-lg mb-12 max-w-2xl leading-relaxed" style={{ "--rv-delay": "200ms" }}>
          {service.description}
        </p>

        {/* What is this service */}
        <section aria-labelledby="what-heading">
          <SectionHeading id="what-heading">
            What is {service.heading}?
          </SectionHeading>
          <div className="space-y-4 text-muted ds-body-lg">
            <p className="reveal" style={{ "--rv-delay": "200ms" }}>
              {service.description} Every engagement runs to priorities and deliverables agreed in writing before work begins.
            </p>
            <p className="reveal" style={{ "--rv-delay": "280ms" }}>
              The work is done personally by Khamare Clarke: BSc Software Engineering, BSc Digital Marketing, MSc Computer Science with Artificial Intelligence (Keele University, completing 2027). No account managers, no junior team members.
            </p>
          </div>
        </section>

        {/* Documented results */}
        <section className="mt-12" aria-labelledby="results-heading">
          <SectionHeading id="results-heading">
            Documented <span className="gold-text">results</span>
          </SectionHeading>
          <div className="grid sm:grid-cols-2 gap-6">
            {documentedResults.map((result, index) => (
              <Card
                key={result.client}
                className="reveal"
                style={{ "--rv-delay": `${index * 110}ms` }}
              >
                <p className="gold-text text-xs font-bold uppercase tracking-widest mb-3">{result.client}</p>
                <p className="ds-numeric text-white text-4xl font-extrabold mb-2">{result.metric}</p>
                <p className="text-muted text-sm leading-relaxed">{result.body}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Location pages */}
        <section className="mt-12" aria-labelledby="locations-heading">
          <SectionHeading id="locations-heading">
            {service.heading} by location
          </SectionHeading>
          <p className="reveal text-muted mb-6" style={{ "--rv-delay": "200ms" }}>Based in Stoke-on-Trent, serving UK-wide:</p>
          <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {TIER_1_LOCATIONS.map((loc, index) => (
              <li key={loc.slug} className="reveal" style={{ "--rv-delay": `${Math.min(index, 6) * 90}ms` }}>
                <Link
                  href={`/services/${service.slug}/${loc.slug}`}
                  className="block bg-surface-muted border border-primary/20 hover:border-primary/50 rounded-lg px-4 py-3 text-muted hover:gold-text text-sm transition-all duration-200"
                >
                  {service.shortTitle} in {loc.name}
                </Link>
              </li>
            ))}
            {ALL_LOCATIONS.filter(l => l.tier !== 1).slice(0, 9).map((loc, index) => (
              <li key={loc.slug} className="reveal" style={{ "--rv-delay": `${Math.min(index, 6) * 90}ms` }}>
                <Link
                  href={`/services/${service.slug}/${loc.slug}`}
                  className="block bg-surface-muted border border-white/10 hover:border-primary/30 rounded-lg px-4 py-3 text-muted hover:gold-text text-sm transition-all duration-200"
                >
                  {service.shortTitle} in {loc.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Related services */}
        <nav className="mt-16 bg-surface-muted border border-primary/20 rounded-lg p-8" aria-label="Related services">
          <p className="text-white font-bold mb-4">Other services</p>
          <ul className="space-y-2">
            {otherServices.map((s, index) => (
              <li key={s.slug} className="reveal" style={{ "--rv-delay": `${Math.min(index, 6) * 90}ms` }}>
                <Link
                  href={`/services/${s.slug}`}
                  className="text-muted hover:gold-text transition-colors flex items-center gap-2 text-sm"
                >
                  <span className="gold-text">→</span> {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* CTA */}
        <CtaPanel headingLevel="h2"
          className="mt-16"
          heading={<>Ready to discuss {service.heading}?</>}
          body="30 minutes. No obligation. An honest look at where your business stands and what it would take to move it."
        >
          <CTAButton eventLabel={`service_hub_${service.slug}_cta`} caption="Priorities and deliverables agreed in writing.">
            Book a Consultation
          </CTAButton>
        </CtaPanel>

        </Container>
      </Section>
    </PageShell>
  );
}
