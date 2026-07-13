import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CTAButton from "../components/CTAButton";
import Link from "next/link";
import { TIER_1_LOCATIONS, TIER_2_LOCATIONS, TIER_3_LOCATIONS, SERVICES } from "../../lib/services-data";
import { PERSON_SCHEMA, PROFESSIONAL_SERVICE_SCHEMA } from "../../lib/schema";

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

export default function LocationsPage() {
  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-br from-[#0a0a0a] via-[#121212] to-[#1a1a1a] relative overflow-hidden">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(PERSON_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(PROFESSIONAL_SERVICE_SCHEMA) }} />

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-1/4 h-64 w-64 md:h-96 md:w-96 rounded-full bg-[#ffb700]/5 blur-3xl gradient-blob" />
        <div className="absolute bottom-0 right-1/4 h-64 w-64 md:h-96 md:w-96 rounded-full bg-[#ff8c00]/4 blur-3xl gradient-blob-b" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-[#ffb700]/3 blur-[100px] gradient-blob-c" />
      </div>

      <Navbar />

      <div className="relative z-10 mx-auto w-full max-w-4xl px-6 sm:px-8 py-24">

        <p className="inline-block bg-[#ffb700] text-[#1a1a1a] text-xs font-bold uppercase tracking-widest py-1 px-3 rounded-full mb-8">
          Coverage
        </p>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-4">
          SEO and AI Services{" "}
          <span className="text-[#ffb700]">Across the UK</span>
        </h1>
        <p className="text-[#ADB7BE] text-lg mb-12 max-w-2xl leading-relaxed">
          Based in Stoke-on-Trent, Staffordshire. Serving businesses across England and the whole of the United Kingdom remotely. In-person available across Staffordshire, Cheshire, the West Midlands, and Greater Manchester.
        </p>

        {/* Primary locations */}
        <section aria-labelledby="primary-heading">
          <h2 id="primary-heading" className="text-2xl sm:text-3xl font-bold text-white mb-6 border-l-4 border-[#ffb700] pl-4">
            Primary service areas
          </h2>
          <div className="grid sm:grid-cols-2 gap-4 mb-12">
            {TIER_1_LOCATIONS.map(location => (
              <div key={location.slug} className="bg-gradient-to-br from-[#181818]/80 to-[#232323]/90 border border-[#ffb700]/20 rounded-2xl p-6">
                <h3 className="text-white font-bold text-lg mb-2">{location.name}</h3>
                <p className="text-[#ADB7BE] text-sm leading-relaxed mb-4">{location.intro}</p>
                <ul className="space-y-1">
                  {SERVICES.slice(0, 4).map(service => (
                    <li key={service.slug}>
                      <Link
                        href={`/services/${service.slug}/${location.slug}`}
                        className="text-[#ffb700] hover:text-[#ff8c00] text-xs transition-colors flex items-center gap-1"
                      >
                        <span>→</span> {service.shortTitle}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Extended UK coverage */}
        <section aria-labelledby="extended-heading">
          <h2 id="extended-heading" className="text-2xl sm:text-3xl font-bold text-white mb-6 border-l-4 border-[#ffb700] pl-4">
            Extended UK coverage
          </h2>
          <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-12">
            {TIER_2_LOCATIONS.map(location => (
              <li key={location.slug}>
                <Link
                  href={`/services/seo-local-seo/${location.slug}`}
                  className="block bg-gradient-to-br from-[#181818]/80 to-[#232323]/90 border border-white/10 hover:border-[#ffb700]/30 rounded-xl px-4 py-3 text-[#ADB7BE] hover:text-[#ffb700] text-sm transition-all duration-200"
                >
                  {location.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Staffordshire and Cheshire towns */}
        <section aria-labelledby="local-heading">
          <h2 id="local-heading" className="text-2xl sm:text-3xl font-bold text-white mb-6 border-l-4 border-[#ffb700] pl-4">
            Staffordshire and Cheshire
          </h2>
          <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-12">
            {TIER_3_LOCATIONS.map(location => (
              <li key={location.slug}>
                <Link
                  href={`/services/seo-local-seo/${location.slug}`}
                  className="block bg-gradient-to-br from-[#181818]/80 to-[#232323]/90 border border-white/10 hover:border-[#ffb700]/20 rounded-xl px-4 py-3 text-[#ADB7BE] hover:text-[#ffb700] text-sm transition-all duration-200"
                >
                  {location.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* About the service area */}
        <section aria-labelledby="area-note">
          <h2 id="area-note" className="text-2xl sm:text-3xl font-bold text-white mb-5 border-l-4 border-[#ffb700] pl-4">
            How remote service delivery works
          </h2>
          <div className="space-y-4 text-[#ADB7BE] text-lg leading-relaxed">
            <p>
              All campaign work — audits, technical SEO, content strategy, Google Business Profile management, AI system setup — is delivered remotely. That means a business in London, Leeds, or Liverpool gets the same quality of work as one in Stoke-on-Trent. There is no geographic discount on quality.
            </p>
            <p>
              Reporting happens monthly via a plain-English update: what was done, where the rankings moved, what is planned next. No dashboards to interpret. For clients who want to meet, video calls are the default. In-person visits are available for Staffordshire, Cheshire, West Midlands, and Greater Manchester clients where that adds value.
            </p>
          </div>
        </section>

        {/* CTA */}
        <div className="mt-16 bg-gradient-to-br from-[#181818]/80 to-[#232323]/90 border border-[#ffb700]/30 rounded-2xl p-10 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Not sure if your area is covered?
          </h2>
          <p className="text-[#ADB7BE] mb-8 max-w-xl mx-auto">
            Every UK business is in scope. Book a free 30-minute call to discuss your situation specifically.
          </p>
          <CTAButton eventLabel="locations_hub_cta" caption="No pitch deck. No obligation.">
            Book Your Free Strategy Call
          </CTAButton>
        </div>

      </div>

      <Footer />
    </main>
  );
}
