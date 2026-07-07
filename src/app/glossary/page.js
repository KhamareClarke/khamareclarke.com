import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CTAButton from "../components/CTAButton";
import { PERSON_SCHEMA, PROFESSIONAL_SERVICE_SCHEMA } from "../../lib/schema";
import { GLOSSARY_TERMS, GLOSSARY_FAMILIES } from "../../lib/glossary-data";

export const metadata = {
  title: "SEO and AI Glossary | Khamare Clarke",
  description:
    "Plain-English definitions of SEO, AI search, AI systems, and digital marketing terms. Every definition written for UK businesses by an SEO specialist and AI systems engineer.",
  alternates: { canonical: "https://khamareclarke.com/glossary" },
  openGraph: {
    title: "SEO and AI Glossary | Khamare Clarke",
    description:
      "Plain-English definitions of SEO, AI search, AI systems, and marketing terms. Written for UK businesses.",
    url: "https://khamareclarke.com/glossary",
    siteName: "Khamare Clarke",
    locale: "en_GB",
    type: "website",
    images: [
      {
        url: "/images/about-image.png",
        width: 1200,
        height: 630,
        alt: "Khamare Clarke SEO and AI Glossary",
      },
    ],
  },
};

const definedTermSetSchema = {
  "@context": "https://schema.org",
  "@type": "DefinedTermSet",
  "@id": "https://khamareclarke.com/glossary#termset",
  "name": "Khamare Clarke Digital Marketing and AI Glossary",
  "description":
    "Plain-English definitions of SEO, AI search, AI systems, and digital marketing terms for UK businesses.",
  "url": "https://khamareclarke.com/glossary",
  "author": { "@type": "Person", "@id": "https://khamareclarke.com/#person" },
};

export default function GlossaryHubPage() {
  const termsByFamily = GLOSSARY_FAMILIES.map((family) => ({
    ...family,
    terms: GLOSSARY_TERMS.filter((t) => t.family === family.id),
  }));

  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-br from-[#0a0a0a] via-[#121212] to-[#1a1a1a] relative overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(PERSON_SCHEMA) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(PROFESSIONAL_SERVICE_SCHEMA) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(definedTermSetSchema) }}
      />

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-1/4 h-64 w-64 md:h-96 md:w-96 rounded-full bg-[#ffb700]/5 blur-3xl gradient-blob" />
        <div className="absolute bottom-0 right-1/4 h-64 w-64 md:h-96 md:w-96 rounded-full bg-[#ff8c00]/4 blur-3xl gradient-blob-b" />
      </div>

      <Navbar />

      <div className="relative z-10 mx-auto w-full max-w-4xl px-6 sm:px-8 py-24">

        <p className="inline-block bg-[#ffb700] text-[#1a1a1a] text-xs font-bold uppercase tracking-widest py-1 px-3 rounded-full mb-8">
          Glossary
        </p>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-4">
          SEO and AI{" "}
          <span className="text-[#ffb700]">Glossary</span>
        </h1>
        <p className="text-[#ADB7BE] text-lg mb-12 max-w-2xl leading-relaxed">
          Plain-English definitions of every term a UK business owner, marketer, or
          fellow professional might encounter. Each page gives you the citable definition
          in the first two sentences, then explains why it matters and how it is applied
          in practice.
        </p>

        {termsByFamily.map((family) => (
          <section key={family.id} className="mb-14" aria-labelledby={`family-${family.id}`}>
            <div className="mb-6">
              <h2
                id={`family-${family.id}`}
                className="text-2xl sm:text-3xl font-bold text-white border-l-4 border-[#ffb700] pl-4"
              >
                {family.label}
              </h2>
              {family.description && (
                <p className="text-[#ADB7BE] text-sm mt-2 pl-5">{family.description}</p>
              )}
            </div>

            <ul className="grid sm:grid-cols-2 gap-3">
              {family.terms.map((term) => (
                <li key={term.slug}>
                  <Link
                    href={`/glossary/${term.slug}`}
                    className="group flex flex-col bg-gradient-to-br from-[#181818]/80 to-[#232323]/90 border border-white/10 hover:border-[#ffb700]/30 rounded-xl px-4 py-3 transition-all duration-200"
                  >
                    <span className="text-white font-semibold text-sm group-hover:text-[#ffb700] transition-colors">
                      {term.abbr ? `${term.title} (${term.abbr})` : term.title}
                    </span>
                    <span className="text-[#ADB7BE] text-xs mt-0.5 line-clamp-1">
                      {term.definition.split(".")[0]}.
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}

        <div className="mt-8 bg-gradient-to-br from-[#181818]/80 to-[#232323]/90 border border-[#ffb700]/30 rounded-2xl p-10 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Not sure which of these applies to your business?
          </h2>
          <p className="text-[#ADB7BE] mb-8 max-w-xl mx-auto">
            Book a free 30-minute call. You will get a straight answer on which
            discipline matters most for your growth trajectory right now.
          </p>
          <CTAButton eventLabel="glossary_hub_cta" caption="No pitch deck. No obligation.">
            Book Your Free Strategy Call
          </CTAButton>
        </div>

      </div>

      <Footer />
    </main>
  );
}
