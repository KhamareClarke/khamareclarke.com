import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import CTAButton from "../../components/CTAButton";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SERVICES, TIER_1_LOCATIONS, ALL_LOCATIONS } from "../../../lib/services-data";
import { PERSON_SCHEMA, PROFESSIONAL_SERVICE_SCHEMA } from "../../../lib/schema";

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
    <main className="flex min-h-screen flex-col bg-[#0a0a0a]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(PERSON_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(PROFESSIONAL_SERVICE_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />

      <Navbar />

      <div className="relative z-10 mx-auto w-full max-w-4xl px-6 sm:px-8 py-24">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-[#ADB7BE] mb-8" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-[#ffb700] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/services" className="hover:text-[#ffb700] transition-colors">Services</Link>
          <span>/</span>
          <span className="text-white">{service.shortTitle}</span>
        </nav>

        <div className="flex items-center gap-4 mb-8 h-4">
          <span className="h-[2px] w-10 shrink-0 bg-gradient-to-r from-transparent to-primary -translate-y-[7px]" aria-hidden="true" />
          <p className="text-xs font-semibold tracking-[0.18em] uppercase gold-text leading-none whitespace-nowrap">
            Service
          </p>
          <span className="h-[2px] w-10 shrink-0 bg-gradient-to-l from-transparent to-primary -translate-y-[7px]" aria-hidden="true" />
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-4">
          {service.heading}
        </h1>
        <p className="text-[#ADB7BE] text-lg mb-12 max-w-2xl leading-relaxed">
          {service.description}
        </p>

        {/* What is this service */}
        <section aria-labelledby="what-heading">
          <h2 id="what-heading" className="text-2xl sm:text-3xl font-bold text-white mb-5 border-l-4 border-[#ffb700] pl-4">
            What is {service.heading}?
          </h2>
          <div className="space-y-4 text-[#ADB7BE] text-lg leading-relaxed">
            <p>
              {service.description} Every campaign is built around agreed ranking targets. If those targets are not hit within 60 days on the Get Found tier, that month's fee is refunded.
            </p>
            <p>
              The work is done personally by Khamare Clarke: BSc Software Engineering, BSc Digital Marketing, MSc Computer Science with Artificial Intelligence (Keele University, completing 2027). No account managers, no junior team members.
            </p>
          </div>
        </section>

        {/* Documented results */}
        <section className="mt-12" aria-labelledby="results-heading">
          <h2 id="results-heading" className="text-2xl sm:text-3xl font-bold text-white mb-6 border-l-4 border-[#ffb700] pl-4">
            Documented results
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

        {/* Location pages */}
        <section className="mt-12" aria-labelledby="locations-heading">
          <h2 id="locations-heading" className="text-2xl sm:text-3xl font-bold text-white mb-6 border-l-4 border-[#ffb700] pl-4">
            {service.heading} by location
          </h2>
          <p className="text-[#ADB7BE] mb-6">Based in Stoke-on-Trent, serving UK-wide:</p>
          <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {TIER_1_LOCATIONS.map(loc => (
              <li key={loc.slug}>
                <Link
                  href={`/services/${service.slug}/${loc.slug}`}
                  className="block bg-gradient-to-br from-[#181818]/80 to-[#232323]/90 border border-[#ffb700]/20 hover:border-[#ffb700]/50 rounded-xl px-4 py-3 text-[#ADB7BE] hover:text-[#ffb700] text-sm transition-all duration-200"
                >
                  {service.shortTitle} in {loc.name}
                </Link>
              </li>
            ))}
            {ALL_LOCATIONS.filter(l => l.tier !== 1).slice(0, 9).map(loc => (
              <li key={loc.slug}>
                <Link
                  href={`/services/${service.slug}/${loc.slug}`}
                  className="block bg-gradient-to-br from-[#181818]/80 to-[#232323]/90 border border-white/10 hover:border-[#ffb700]/30 rounded-xl px-4 py-3 text-[#ADB7BE] hover:text-[#ffb700] text-sm transition-all duration-200"
                >
                  {service.shortTitle} in {loc.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Related services */}
        <nav className="mt-16 bg-gradient-to-br from-[#181818]/80 to-[#232323]/90 border border-[#ffb700]/20 rounded-2xl p-8" aria-label="Related services">
          <p className="text-white font-bold mb-4">Other services</p>
          <ul className="space-y-2">
            {otherServices.map(s => (
              <li key={s.slug}>
                <Link
                  href={`/services/${s.slug}`}
                  className="text-[#ADB7BE] hover:text-[#ffb700] transition-colors flex items-center gap-2 text-sm"
                >
                  <span className="text-[#ffb700]">→</span> {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* CTA */}
        <div className="mt-12 bg-gradient-to-br from-[#181818]/80 to-[#232323]/90 border border-[#ffb700]/30 rounded-2xl p-10 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Ready to discuss {service.heading}?
          </h2>
          <p className="text-[#ADB7BE] mb-8 max-w-xl mx-auto">
            30 minutes. No obligation. An honest look at where your business stands and what it would take to move it.
          </p>
          <CTAButton eventLabel={`service_hub_${service.slug}_cta`} caption="ranked or refunded in 60 days · from £495/mo">
            Book Your Free Strategy Call
          </CTAButton>
        </div>

      </div>

      <Footer />
    </main>
  );
}
