import Link from "next/link";
import { notFound } from "next/navigation";
import PageShell from "../../../components/PageShell";
import PageHero from "../../../components/ui/PageHero";
import AchievementsSection from "../../../components/AchievementsSection";
import SectionHeading from "../../../components/ui/SectionHeading";
import CtaPanel from "../../../components/ui/CtaPanel";
import { Section } from "../../../components/ui/Section";
import { Container } from "../../../components/ui/Container";
import Card from "../../../components/ui/Card";
import CTAButton from "../../../components/CTAButton";
import { SERVICES, ALL_LOCATIONS } from "../../../../lib/services-data";

export async function generateStaticParams() {
  return SERVICES.flatMap(service =>
    ALL_LOCATIONS.map(location => ({
      service: service.slug,
      location: location.slug,
    }))
  );
}

export async function generateMetadata({ params }) {
  const service = SERVICES.find(s => s.slug === params.service);
  const location = ALL_LOCATIONS.find(l => l.slug === params.location);
  if (!service || !location) return {};

  const title = `${service.title} in ${location.name} | Khamare Clarke`;
  const description = `${service.heading} for businesses in ${location.name}, ${location.region}. ${service.description} Serving from Stoke-on-Trent, Staffordshire.`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://khamareclarke.com/services/${service.slug}/${location.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://khamareclarke.com/services/${service.slug}/${location.slug}`,
      siteName: "Khamare Clarke",
      locale: "en_GB",
      type: "article",
    },
  };
}

function buildServiceSchema(service, location) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": `${service.title} in ${location.name}`,
    "serviceType": service.title,
    "provider": {
      "@id": "https://khamareclarke.com/#business",
    },
    "areaServed": {
      "@type": "City",
      "name": location.name,
      "containedInPlace": {
        "@type": "AdministrativeArea",
        "name": location.region,
      },
    },
    "url": `https://khamareclarke.com/services/${service.slug}/${location.slug}`,
  };
}

function buildFaqSchema(service, location) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `Does Khamare Clarke offer ${service.title} in ${location.name}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Yes. ${service.heading} services are available to businesses in ${location.name} and the wider ${location.region} area. Most work is delivered remotely with no loss of quality. For clients in ${location.name}, in-person meetings can be arranged.`,
        },
      },
      {
        "@type": "Question",
        "name": `How much does ${service.title} cost for a ${location.name} business?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Pricing depends on the scope of the work, the competition level in ${location.name}, and the volume of work required. A free 30-minute strategy call gives an accurate picture for your specific situation.`,
        },
      },
      {
        "@type": "Question",
        "name": `How long before a ${location.name} business sees results from ${service.shortTitle}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `For local campaigns targeting ${location.name}, movement in search visibility typically becomes measurable over the first three to six months. Priorities and deliverables are agreed in writing at the start of every engagement.`,
        },
      },
    ],
  };
}

function getLocationIntro(service, location) {
  if (location.intro) {
    return location.intro;
  }
  return `${location.name} businesses operating in ${location.region} face consistent local search competition. Appearing at the top of Google for your service in ${location.name} is achievable — but it requires the right technical foundation, accurate Google Business Profile management, and content that Google and AI engines trust.`;
}

function getLocalNote(service, location) {
  if (location.localNote) {
    return location.localNote;
  }
  return `${location.name} is served from Stoke-on-Trent. All campaigns, builds, and systems run directly from there. Most work is delivered remotely, with in-person visits available for clients where that matters.`;
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

export default function ServiceLocationPage({ params }) {
  const service = SERVICES.find(s => s.slug === params.service);
  const location = ALL_LOCATIONS.find(l => l.slug === params.location);

  if (!service || !location) notFound();

  const serviceSchema = buildServiceSchema(service, location);
  const faqSchema = buildFaqSchema(service, location);
  const intro = getLocationIntro(service, location);
  const localNote = getLocalNote(service, location);

  const relatedServices = SERVICES.filter(s => s.slug !== service.slug).slice(0, 4);

  return (
    <PageShell
      schema={
        <>
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
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
          <Link href={`/services/${service.slug}`} className="hover:gold-text transition-colors">{service.shortTitle}</Link>
          <span>/</span>
          <span className="text-white">{location.name}</span>
        </nav>

        <PageHero eyebrow={`Serving ${location.name}`} title={<>{service.heading} <span className="gold-text">in {location.name}</span></>} size="compact" />

        {/* The trust strip that sits under the hero on the homepage. */}
        <AchievementsSection />
        <p className="reveal mt-6 text-muted text-lg mb-12 max-w-2xl leading-relaxed" style={{ "--rv-delay": "200ms" }}>
          {service.description}
        </p>

        {/* Location intro */}
        <section aria-labelledby="location-context">
          <SectionHeading id="location-context">
            {service.shortTitle} in {location.name} — the context
          </SectionHeading>
          <p className="reveal text-muted ds-body-lg mb-4" style={{ "--rv-delay": "200ms" }}>{intro}</p>
          <p className="reveal text-muted ds-body-lg" style={{ "--rv-delay": "280ms" }}>{localNote}</p>
        </section>

        {/* What this service involves */}
        <section className="mt-12" aria-labelledby="service-scope">
          <SectionHeading id="service-scope">
            What does {service.heading} involve for a {location.name} business?
          </SectionHeading>
          <div className="space-y-4 text-muted ds-body-lg">
            <p className="reveal" style={{ "--rv-delay": "200ms" }}>
              Every engagement starts with an audit: what is the current state of the site, the Google Business Profile (where applicable), the local citations, and the structured data? The audit identifies the highest-leverage actions — the fixes that produce the fastest ranking movement — and those go first.
            </p>
            <p className="reveal" style={{ "--rv-delay": "280ms" }}>
              For {location.name} businesses, that typically means technical fixes that are suppressing rankings right now, followed by content and authority work that compounds over time. The campaign is built around agreed targets, not a general promise of "better rankings".
            </p>
          </div>
        </section>

        {/* Documented results */}
        <section className="mt-12" aria-labelledby="results">
          <SectionHeading id="results">
            Documented <span className="gold-text">results</span> from live campaigns
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

        {/* FAQ */}
        <section className="mt-12" aria-labelledby="faq">
          <SectionHeading id="faq">
            Common questions from {location.name} businesses
          </SectionHeading>

          <div className="space-y-6">
            <div className="reveal" style={{ "--rv-delay": "200ms" }}>
              <h3 className="text-lg font-bold text-white mb-3">
                Does Khamare Clarke offer {service.shortTitle} in {location.name}?
              </h3>
              <p className="text-muted ds-body">
                Yes. {service.heading} services are available to businesses in {location.name} and the wider {location.region} area. Most work is delivered remotely with no loss of quality. For {location.name} clients where an in-person meeting would help, that can be arranged.
              </p>
            </div>

            <div className="reveal" style={{ "--rv-delay": "280ms" }}>
              <h3 className="text-lg font-bold text-white mb-3">
                How much does {service.shortTitle} cost in {location.name}?
              </h3>
              <p className="text-muted ds-body">
                Pricing depends on the scope of the work, the competition level in {location.name}, and the volume of work required. A 30-minute strategy call gives an accurate picture for your specific situation in {location.name}.
              </p>
            </div>

            <div className="reveal" style={{ "--rv-delay": "360ms" }}>
              <h3 className="text-lg font-bold text-white mb-3">
                How long before a {location.name} business sees results?
              </h3>
              <p className="text-muted ds-body">
                For local campaigns, movement in search visibility typically becomes
                measurable over the first three to six months. Priorities and deliverables
                are agreed in writing at the start of every engagement.
              </p>
            </div>
          </div>
        </section>

        {/* Related services */}
        <nav className="mt-16 bg-surface-muted border border-primary/20 rounded-lg p-8" aria-label="Related services">
          <p className="text-white font-bold mb-4">Other services for {location.name} businesses</p>
          <ul className="space-y-2">
            {relatedServices.map((s, index) => (
              <li key={s.slug} className="reveal" style={{ "--rv-delay": `${Math.min(index, 6) * 90}ms` }}>
                <Link
                  href={`/services/${s.slug}/${location.slug}`}
                  className="text-muted hover:gold-text transition-colors flex items-center gap-2 text-sm"
                >
                  <span className="gold-text">→</span>
                  {s.title} in {location.name}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-4 pt-4 border-t border-primary/10">
            <Link href="/services" className="text-muted hover:gold-text transition-colors text-sm flex items-center gap-2">
              <span className="gold-text">←</span> All services
            </Link>
          </div>
        </nav>

        {/* CTA */}
        <CtaPanel headingLevel="h2"
          className="mt-16"
          heading={<>Ready to talk about {service.shortTitle} in {location.name}?</>}
          body={`30 minutes. No obligation. An honest assessment of where your ${location.name} business stands and what it would take to move it.`}
        >
          <CTAButton eventLabel={`service_${service.slug}_${location.slug}_cta`} caption="Priorities and deliverables agreed in writing.">
            Book a Consultation
          </CTAButton>
        </CtaPanel>

        </Container>
      </Section>
    </PageShell>
  );
}
