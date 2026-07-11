import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import CTAButton from "../../../components/CTAButton";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SERVICES, ALL_LOCATIONS } from "../../../../lib/services-data";
import { PERSON_SCHEMA, PROFESSIONAL_SERVICE_SCHEMA } from "../../../../lib/schema";

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
          "text": `Services start from £495 per month on the Get Found tier, rising to £1,250/mo for Run The Area and £2,500/mo for Own The Market. Pricing depends on the scope, competition level in ${location.name}, and the volume of work required. A free 30-minute strategy call gives an accurate picture for your specific situation.`,
        },
      },
      {
        "@type": "Question",
        "name": `How long before a ${location.name} business sees results from ${service.shortTitle}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `For local campaigns targeting ${location.name}, meaningful results typically appear within 60 to 90 days. Ranking targets are agreed at the start of every engagement. On the Get Found tier, if those agreed targets are not reached within 60 days, that month's fee is refunded in full.`,
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
    <main className="flex min-h-screen flex-col bg-gradient-to-br from-[#0a0a0a] via-[#121212] to-[#1a1a1a] relative overflow-hidden">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(PERSON_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(PROFESSIONAL_SERVICE_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-1/4 h-64 w-64 md:h-96 md:w-96 rounded-full bg-[#ffb700]/5 blur-3xl gradient-blob" />
        <div className="absolute bottom-0 right-1/4 h-64 w-64 md:h-96 md:w-96 rounded-full bg-[#ff8c00]/4 blur-3xl gradient-blob-b" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 md:h-[600px] md:w-[600px] rounded-full bg-[#ffb700]/3 blur-[100px] gradient-blob-c" />
      </div>

      <Navbar />

      <div className="relative z-10 mx-auto w-full max-w-4xl px-6 sm:px-8 py-24">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-[#ADB7BE] mb-8" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-[#ffb700] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/services" className="hover:text-[#ffb700] transition-colors">Services</Link>
          <span>/</span>
          <Link href={`/services/${service.slug}`} className="hover:text-[#ffb700] transition-colors">{service.shortTitle}</Link>
          <span>/</span>
          <span className="text-white">{location.name}</span>
        </nav>

        {/* Label badge */}
        <p className="inline-block bg-[#ffb700] text-[#1a1a1a] text-xs font-bold uppercase tracking-widest py-1 px-3 rounded-full mb-8">
          {service.icon} Serving {location.name}
        </p>

        {/* H1 */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-4">
          {service.heading}{" "}
          <span className="text-[#ffb700]">in {location.name}</span>
        </h1>
        <p className="text-[#ADB7BE] text-lg mb-12 max-w-2xl leading-relaxed">
          {service.description}
        </p>

        {/* Location intro */}
        <section aria-labelledby="location-context">
          <h2 id="location-context" className="text-2xl sm:text-3xl font-bold text-white mb-5 border-l-4 border-[#ffb700] pl-4">
            {service.shortTitle} in {location.name} — the context
          </h2>
          <p className="text-[#ADB7BE] text-lg leading-relaxed mb-4">{intro}</p>
          <p className="text-[#ADB7BE] text-lg leading-relaxed">{localNote}</p>
        </section>

        {/* What this service involves */}
        <section className="mt-12" aria-labelledby="service-scope">
          <h2 id="service-scope" className="text-2xl sm:text-3xl font-bold text-white mb-5 border-l-4 border-[#ffb700] pl-4">
            What does {service.heading} involve for a {location.name} business?
          </h2>
          <div className="space-y-4 text-[#ADB7BE] text-lg leading-relaxed">
            <p>
              Every engagement starts with an audit: what is the current state of the site, the Google Business Profile (where applicable), the local citations, and the structured data? The audit identifies the highest-leverage actions — the fixes that produce the fastest ranking movement — and those go first.
            </p>
            <p>
              For {location.name} businesses, that typically means technical fixes that are suppressing rankings right now, followed by content and authority work that compounds over time. The campaign is built around agreed targets, not a general promise of "better rankings".
            </p>
          </div>
        </section>

        {/* Documented results */}
        <section className="mt-12" aria-labelledby="results">
          <h2 id="results" className="text-2xl sm:text-3xl font-bold text-white mb-6 border-l-4 border-[#ffb700] pl-4">
            Documented results from live campaigns
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-[#181818] via-[#0A0A0A] to-black rounded-2xl border-2 border-[#ffb700]/30 p-6">
              <p className="text-[#ffb700] text-xs font-bold uppercase tracking-widest mb-3">Upgrade Roofing Solutions</p>
              <p className="text-white text-4xl font-extrabold mb-2">538%</p>
              <p className="text-[#ADB7BE] text-sm leading-relaxed">
                Growth in Google Business Profile interactions in 90 days. Over 30 qualified inbound calls in the first two weeks.
              </p>
            </div>
            <div className="bg-gradient-to-br from-[#181818] via-[#0A0A0A] to-black rounded-2xl border-2 border-[#ffb700]/30 p-6">
              <p className="text-[#ffb700] text-xs font-bold uppercase tracking-widest mb-3">City Plaza Abu Dhabi</p>
              <p className="text-white text-4xl font-extrabold mb-2">5X</p>
              <p className="text-[#ADB7BE] text-sm leading-relaxed">
                Lead volume within 60 days, scaling to approximately 20 qualified enquiries per day at peak.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-12 space-y-8" aria-labelledby="faq">
          <h2 id="faq" className="text-2xl sm:text-3xl font-bold text-white mb-5 border-l-4 border-[#ffb700] pl-4">
            Common questions from {location.name} businesses
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white mb-3">
                Does Khamare Clarke offer {service.shortTitle} in {location.name}?
              </h3>
              <p className="text-[#ADB7BE] leading-relaxed">
                Yes. {service.heading} services are available to businesses in {location.name} and the wider {location.region} area. Most work is delivered remotely with no loss of quality. For {location.name} clients where an in-person meeting would help, that can be arranged.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-white mb-3">
                How much does {service.shortTitle} cost in {location.name}?
              </h3>
              <p className="text-[#ADB7BE] leading-relaxed">
                Services start from £495 per month on the Get Found tier. Run The Area starts at £1,250/mo and Own The Market at £2,500/mo. A 30-minute strategy call gives an accurate picture for your specific situation in {location.name}.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-white mb-3">
                How long before a {location.name} business sees results?
              </h3>
              <p className="text-[#ADB7BE] leading-relaxed">
                For local campaigns, meaningful movement typically appears within 60 to 90 days. Ranking targets are agreed at the start. On the Get Found tier, if those targets are not reached within 60 days, that month's fee is refunded in full.
              </p>
            </div>
          </div>
        </section>

        {/* Related services */}
        <nav className="mt-16 bg-gradient-to-br from-[#181818]/80 to-[#232323]/90 border border-[#ffb700]/20 rounded-2xl p-8" aria-label="Related services">
          <p className="text-white font-bold mb-4">Other services for {location.name} businesses</p>
          <ul className="space-y-2">
            {relatedServices.map(s => (
              <li key={s.slug}>
                <Link
                  href={`/services/${s.slug}/${location.slug}`}
                  className="text-[#ADB7BE] hover:text-[#ffb700] transition-colors flex items-center gap-2 text-sm"
                >
                  <span className="text-[#ffb700]">→</span>
                  {s.title} in {location.name}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-4 pt-4 border-t border-[#ffb700]/10">
            <Link href="/services" className="text-[#ADB7BE] hover:text-[#ffb700] transition-colors text-sm flex items-center gap-2">
              <span className="text-[#ffb700]">←</span> All services
            </Link>
          </div>
        </nav>

        {/* CTA */}
        <div className="mt-12 bg-gradient-to-br from-[#181818]/80 to-[#232323]/90 border border-[#ffb700]/30 rounded-2xl p-10 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Ready to talk about {service.shortTitle} in {location.name}?
          </h2>
          <p className="text-[#ADB7BE] mb-8 max-w-xl mx-auto">
            30 minutes. No obligation. An honest assessment of where your {location.name} business stands and what it would take to move it.
          </p>
          <CTAButton eventLabel={`service_${service.slug}_${location.slug}_cta`} caption="ranked or refunded in 60 days · from £495/mo">
            Book Your Free Strategy Call
          </CTAButton>
        </div>

      </div>

      <Footer />
    </main>
  );
}
