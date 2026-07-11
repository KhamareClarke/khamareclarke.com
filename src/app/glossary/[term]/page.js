import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import CTAButton from "../../components/CTAButton";
import { PERSON_SCHEMA } from "../../../lib/schema";
import { GLOSSARY_TERMS, GLOSSARY_BY_SLUG } from "../../../lib/glossary-data";

export function generateStaticParams() {
  return GLOSSARY_TERMS.map((t) => ({ term: t.slug }));
}

export function generateMetadata({ params }) {
  const term = GLOSSARY_BY_SLUG[params.term];
  if (!term) return {};
  return {
    title: term.metaTitle,
    description: term.metaDescription,
    alternates: { canonical: `https://khamareclarke.com/glossary/${term.slug}` },
    openGraph: {
      title: term.metaTitle,
      description: term.metaDescription,
      url: `https://khamareclarke.com/glossary/${term.slug}`,
      siteName: "Khamare Clarke",
      locale: "en_GB",
      type: "article",
      images: [
        {
          url: "/images/about-image.png",
          width: 1200,
          height: 630,
          alt: `${term.title} -- Khamare Clarke Glossary`,
        },
      ],
    },
  };
}

export default function GlossaryTermPage({ params }) {
  const term = GLOSSARY_BY_SLUG[params.term];
  if (!term) return notFound();

  const definedTermSchema = {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    "@id": `https://khamareclarke.com/glossary/${term.slug}#term`,
    "name": term.abbr ? `${term.title} (${term.abbr})` : term.title,
    "description": term.definition,
    "inDefinedTermSet": {
      "@type": "DefinedTermSet",
      "name": "Khamare Clarke Digital Marketing and AI Glossary",
      "url": "https://khamareclarke.com/glossary",
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: term.faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  const relatedTermObjects = term.relatedTerms
    .map((slug) => GLOSSARY_BY_SLUG[slug])
    .filter(Boolean);

  const displayTitle = term.abbr ? `${term.title} (${term.abbr})` : term.title;

  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-br from-[#0a0a0a] via-[#121212] to-[#1a1a1a]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(PERSON_SCHEMA) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(definedTermSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-[#ffb700]/5 blur-3xl gradient-blob" />
        <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-[#ff8c00]/4 blur-3xl gradient-blob-b" />
      </div>

      <Navbar />

      <div className="relative z-10 mx-auto w-full max-w-4xl px-6 sm:px-8 py-24">

        <nav className="flex items-center gap-2 text-xs text-[#ADB7BE] mb-8" aria-label="Breadcrumb">
          <Link href="/glossary" className="hover:text-[#ffb700] transition-colors">Glossary</Link>
          <span>/</span>
          <span className="text-white">{term.title}</span>
        </nav>

        <p className="inline-block bg-[#ffb700] text-[#1a1a1a] text-xs font-bold uppercase tracking-widest py-1 px-3 rounded-full mb-8">
          {term.badge}
        </p>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
          {term.h1}
        </h1>

        {/* Citable definition block */}
        <div className="bg-gradient-to-br from-[#181818]/80 to-[#232323]/90 border border-[#ffb700]/30 rounded-2xl p-6 mb-12">
          <p className="text-white text-lg leading-relaxed font-medium">{term.definition}</p>
        </div>

        {/* Why it matters */}
        <section className="mt-8" aria-labelledby="why-matters">
          <h2 id="why-matters" className="text-2xl sm:text-3xl font-bold text-white mb-5 border-l-4 border-[#ffb700] pl-4">
            Why {term.title.toLowerCase()} matters for UK businesses
          </h2>
          <div className="space-y-4 text-[#ADB7BE] text-lg leading-relaxed">
            {term.whyItMatters.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </section>

        {/* How Khamare applies it */}
        <section className="mt-12" aria-labelledby="how-applied">
          <h2 id="how-applied" className="text-2xl sm:text-3xl font-bold text-white mb-5 border-l-4 border-[#ffb700] pl-4">
            How Khamare Clarke applies {term.title.toLowerCase()}
          </h2>
          <div className="space-y-4 text-[#ADB7BE] text-lg leading-relaxed">
            {term.howKhamareApplies.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </section>

        {/* FAQ sections */}
        {term.faq.map((item, i) => (
          <section key={i} className="mt-12" aria-labelledby={`faq-${i}`}>
            <h2 id={`faq-${i}`} className="text-2xl sm:text-3xl font-bold text-white mb-5 border-l-4 border-[#ffb700] pl-4">
              {item.q}
            </h2>
            <p className="text-[#ADB7BE] text-lg leading-relaxed">{item.a}</p>
          </section>
        ))}

        {/* Related terms + expertise link */}
        <nav className="mt-16 bg-[#1a1a1a] border border-white/10 rounded-2xl p-8" aria-label="Related terms">
          <p className="text-white font-bold mb-4">Related terms</p>
          <ul className="space-y-2">
            {relatedTermObjects.map((related) => (
              <li key={related.slug}>
                <Link
                  href={`/glossary/${related.slug}`}
                  className="text-[#ADB7BE] hover:text-[#ffb700] transition-colors flex items-center gap-2 text-sm"
                >
                  <span className="text-[#ffb700]">--</span>{" "}
                  {related.abbr ? `${related.title} (${related.abbr})` : related.title}
                </Link>
              </li>
            ))}
            {term.expertisePage && (
              <li>
                <Link
                  href={term.expertisePage}
                  className="text-[#ADB7BE] hover:text-[#ffb700] transition-colors flex items-center gap-2 text-sm"
                >
                  <span className="text-[#ffb700]">--</span> Related expertise
                </Link>
              </li>
            )}
            <li>
              <Link
                href="/glossary"
                className="text-[#ADB7BE] hover:text-[#ffb700] transition-colors flex items-center gap-2 text-sm"
              >
                <span className="text-[#ffb700]">--</span> Back to full glossary
              </Link>
            </li>
          </ul>
        </nav>

        {/* CTA */}
        <div className="mt-12 bg-[#1a1a1a] border border-[#ffb700]/30 rounded-2xl p-10 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Apply {displayTitle} to your business
          </h2>
          <p className="text-[#ADB7BE] mb-8 max-w-xl mx-auto">
            Book a free 30-minute strategy call. No obligation, no sales team.
            You will get an honest assessment of where your business stands
            and what this would change.
          </p>
          <CTAButton
            eventLabel={`glossary_${term.slug}_cta`}
            caption="No pitch deck. No obligation."
          >
            Book Your Free Strategy Call
          </CTAButton>
        </div>

      </div>

      <Footer />
    </main>
  );
}
