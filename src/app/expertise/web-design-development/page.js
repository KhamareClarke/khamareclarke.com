// src/app/expertise/web-design-development/page.js

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Link from "next/link";
import CTAButton from "../../components/CTAButton";
import { PERSON_SCHEMA, PROFESSIONAL_SERVICE_SCHEMA } from "../../../lib/schema";

export const metadata = {
  title: "Web Design and Development UK | Khamare Clarke -- Stoke-on-Trent",
  description:
    "Performance-first web design and development for UK businesses. Custom websites and web apps engineered to rank and convert. Next.js, static generation, built to rank in Google and in AI search.",
  alternates: { canonical: "https://khamareclarke.com/expertise/web-design-development" },
  openGraph: {
    title: "Web Design and Development UK | Khamare Clarke",
    description:
      "Performance-first web design and development for UK businesses. Custom websites and web apps engineered to rank and convert.",
    url: "https://khamareclarke.com/expertise/web-design-development",
    siteName: "Khamare Clarke",
    locale: "en_GB",
    type: "article",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is conversion-focused web design?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Conversion-focused web design is web design informed by search intent and user behaviour at the point of landing, not just by visual aesthetics. Every layout decision -- headline placement, call to action position, page speed, mobile experience -- is made to maximise the proportion of visitors who take the action the business needs, whether that is a phone call, a form submission, or a booked appointment. The visual quality and the commercial performance are not in tension; the best-converting pages are also the ones that communicate most clearly.",
      },
    },
    {
      "@type": "Question",
      name: "What is the difference between a web designer and a web developer?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A web designer focuses on the visual and UX layer: layout, typography, colour, user flow, and how the site communicates trust and intent to a visitor. A web developer focuses on the technical layer: the code, the database, the API integrations, the performance optimisations, and the architecture that makes the site fast, scalable, and maintainable. Most projects need both. Building them together -- with the designer and developer being the same person or a closely coordinated pair -- produces sites that are faster to build, more coherent, and better optimised for both search and conversion.",
      },
    },
    {
      "@type": "Question",
      name: "Why does web design matter for SEO?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Web design and SEO are not separate disciplines. Core Web Vitals (the page speed and stability signals Google uses as a ranking factor) are determined by how the site is built. Internal link structure, which determines how PageRank flows through the site, is a design decision. The clarity of the page content -- which search engines use to understand what the page is about -- is determined by how information is presented, not just written. A site that is slow, confusing to navigate, or structured without regard for crawlability cannot rank well regardless of how much SEO work is done to it.",
      },
    },
    {
      "@type": "Question",
      name: "What types of web projects are available?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Projects cover: custom marketing websites built for ranking and conversion, programmatic sites that generate hundreds of unique pages from structured data (service-by-location pages, product catalogues, directory listings), web applications with authenticated user areas (client portals, booking systems, dashboards), and custom integrations connecting the website to CRM, payment, and AI systems. All builds use Next.js with static-site generation for maximum performance and crawlability.",
      },
    },
  ],
};

export default function WebDesignDevelopmentPage() {
  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-br from-[#0a0a0a] via-[#121212] to-[#1a1a1a]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(PERSON_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(PROFESSIONAL_SERVICE_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-[#ffb700]/5 blur-3xl gradient-blob" />
        <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-[#ff8c00]/4 blur-3xl gradient-blob-b" />
      </div>

      <Navbar />

      <div className="relative z-10 mx-auto w-full max-w-4xl px-6 sm:px-8 py-24">

        <p className="inline-block bg-[#ffb700] text-[#1a1a1a] text-xs font-bold uppercase tracking-widest py-1 px-3 rounded-full mb-8">
          Expertise
        </p>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-4">
          Web Design and Development{" "}
          <span className="text-[#ffb700]">-- Engineered to Rank and Convert</span>
        </h1>
        <p className="text-[#ADB7BE] text-lg mb-16 max-w-2xl">
          A themed template does not rank. A site designed in a vacuum does not
          convert. Web design and development here are the same discipline: the visual
          decisions and the engineering decisions are made together, with search
          performance and conversion as the joint objective.
        </p>

        <section className="mt-12" aria-labelledby="q1">
          <h2 id="q1" className="text-2xl sm:text-3xl font-bold text-white mb-5 border-l-4 border-[#ffb700] pl-4">
            Conversion-focused web design
          </h2>
          <div className="space-y-4 text-[#ADB7BE] text-lg leading-relaxed">
            <p>
              Conversion-focused web design is design informed by search intent and
              user behaviour at the point of landing. Every layout decision -- headline
              placement, call to action position, page speed, mobile experience, trust
              signal placement -- is made to maximise the proportion of visitors who
              take the action the business needs.
            </p>
            <p>
              The visual quality and the commercial performance are not in tension.
              The best-converting pages are the ones that communicate most clearly.
              Clarity is a design discipline: it comes from understanding what the
              visitor needs to see in the first three seconds to stay on the page and
              take action.
            </p>
          </div>
        </section>

        <section className="mt-12" aria-labelledby="q2">
          <h2 id="q2" className="text-2xl sm:text-3xl font-bold text-white mb-5 border-l-4 border-[#ffb700] pl-4">
            Why web design matters for SEO
          </h2>
          <div className="space-y-4 text-[#ADB7BE] text-lg leading-relaxed">
            <p>
              Web design and SEO are not separate disciplines. Core Web Vitals --
              the page speed and stability signals Google uses as a ranking factor
              -- are determined by how the site is built. Internal link structure,
              which determines how authority flows through the site, is a design
              decision. The clarity of page content, which search engines use to
              understand relevance, is determined by how information is presented,
              not just written.
            </p>
            <p>
              A site that is slow, confusing to navigate, or structured without
              regard for crawlability cannot rank well regardless of how much SEO
              work is done to it afterwards. Building ranking in from the start is
              faster and less expensive than retrofitting it.
            </p>
          </div>
        </section>

        <section className="mt-12" aria-labelledby="q3">
          <h2 id="q3" className="text-2xl sm:text-3xl font-bold text-white mb-5 border-l-4 border-[#ffb700] pl-4">
            Types of web projects
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              ["Marketing websites", "Custom sites built for ranking and conversion, with SEO architecture built in from the first page."],
              ["Programmatic sites", "Hundreds of unique, indexable pages generated from structured data: service-by-location, directories, catalogues."],
              ["Web applications", "Authenticated user areas, booking systems, client portals, dashboards -- engineered, not themed."],
              ["Custom integrations", "Website connected to CRM, payment systems, AI agents, Google Ads API, and third-party data sources."],
            ].map(([title, body]) => (
              <div key={title} className="bg-[#1a1a1a] border border-[#ffb700]/20 rounded-xl p-5">
                <p className="text-[#ffb700] font-semibold text-sm mb-2">{title}</p>
                <p className="text-[#ADB7BE] text-sm leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12" aria-labelledby="q4">
          <h2 id="q4" className="text-2xl sm:text-3xl font-bold text-white mb-5 border-l-4 border-[#ffb700] pl-4">
            What all builds have in common
          </h2>
          <div className="space-y-4 text-[#ADB7BE] text-lg leading-relaxed">
            <p>
              All sites are built with Next.js using static-site generation. Pages are
              pre-rendered as HTML at build time, which means they are fast, crawlable
              without JavaScript, and scored well on Core Web Vitals from launch. The
              code is written here; nothing is delegated to a theme marketplace or a
              no-code builder that removes control over performance and SEO.
            </p>
            <p>
              JSON-LD structured data is implemented on every relevant page: Person,
              ProfessionalService, FAQPage, DefinedTerm, Article, BreadcrumbList. This
              gives search engines and AI models the entity signals they need to cite
              the business accurately, and it is the technical foundation of AI search
              visibility as well as traditional Google ranking.
            </p>
          </div>
        </section>

        <nav className="mt-16 bg-[#1a1a1a] border border-white/10 rounded-2xl p-8" aria-label="Related expertise">
          <p className="text-white font-bold mb-4">Related expertise</p>
          <ul className="space-y-2">
            {[
              { href: "/expertise/ai-implementation", label: "AI implementation" },
              { href: "/expertise/programmatic-seo", label: "Programmatic SEO -- engineered pages that scale" },
              { href: "/expertise/seo", label: "SEO specialist" },
              { href: "/expertise/digital-marketing", label: "Digital marketing" },
              { href: "/expertise/google-ranking", label: "Rank number one on Google" },
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-[#ADB7BE] hover:text-[#ffb700] transition-colors flex items-center gap-2 text-sm">
                  <span className="text-[#ffb700]">--</span> {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-12 bg-[#1a1a1a] border border-[#ffb700]/30 rounded-2xl p-10 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Ready for a site that ranks and converts?
          </h2>
          <p className="text-[#ADB7BE] mb-8 max-w-xl mx-auto">
            Book a free 30-minute call. We will look at your current site,
            identify the highest-impact structural changes, and discuss what a
            purpose-built replacement would look like.
          </p>
          <CTAButton eventLabel="expertise_web_design_cta" caption="No pitch deck. No obligation.">
            Book Your Free Strategy Call
          </CTAButton>
        </div>
      </div>

      <Footer />
    </main>
  );
}
