// src/app/expertise/digital-marketing/page.js

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Link from "next/link";
import CTAButton from "../../components/CTAButton";
import { PERSON_SCHEMA, PROFESSIONAL_SERVICE_SCHEMA } from "../../../lib/schema";

export const metadata = {
  title: "Digital Marketing Consultant UK | Khamare Clarke | Stoke-on-Trent",
  description:
    "Digital marketing for UK businesses: search, paid, email, content, and automation -- all AI-enhanced. Working alongside your existing team. Based in Stoke-on-Trent, serving the whole of the UK.",
  alternates: { canonical: "https://khamareclarke.com/expertise/digital-marketing" },
  openGraph: {
    title: "Digital Marketing Consultant UK | Khamare Clarke",
    description:
      "Digital marketing for UK businesses: search, paid, email, content, and automation -- all AI-enhanced.",
    url: "https://khamareclarke.com/expertise/digital-marketing",
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
      name: "What does a digital marketing consultant do?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A digital marketing consultant develops and executes strategy across the channels that drive revenue for a business: search (SEO and AI search), paid advertising, email, content, and automation. The emphasis is on the channels that match the business model and budget -- not the channels that are fashionable. For most UK small and medium businesses, this means local SEO and Google Business Profile as the foundation, with paid search for immediate volume, email automation for follow-up, and AI search optimisation for the growing proportion of searches answered by ChatGPT, Gemini, and Perplexity.",
      },
    },
    {
      "@type": "Question",
      name: "What is the difference between a digital marketing consultant and a digital marketing agency?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A digital marketing agency allocates your account to an account manager who coordinates between separate SEO, PPC, content, and social teams. A consultant does the work themselves or directs a small, specialist team. The practical difference is coherence and accountability: with a consultant, the strategy and the execution are held by the same person, which removes the translation layer where agency campaigns lose nuance and speed.",
      },
    },
    {
      "@type": "Question",
      name: "How does AI change digital marketing?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "AI changes digital marketing in two directions simultaneously. On the visibility side, search is shifting from ten blue links to AI-generated answers in ChatGPT, Gemini, Perplexity, and Google AI Overviews. Businesses that are not optimised for these answers are invisible to a growing proportion of searchers. On the operations side, AI agents can handle lead response, qualification, follow-up, and CRM updates that previously required staff time. The businesses that combine both -- AI-enhanced visibility and AI-handled operations -- have a compounding advantage over those that do not.",
      },
    },
    {
      "@type": "Question",
      name: "What digital marketing services are available?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Services cover: SEO and local SEO (Google rankings and Google Business Profile management), AI search optimisation (AEO and GEO for ChatGPT, Gemini, Perplexity, and AI Overviews), Google Ads managed via the Ads API, email marketing automation and lead nurturing, CRM setup and automation, content strategy and AI-assisted content production, web development, and AI agent deployment for lead handling. These are available individually or as an integrated retainer across all channels.",
      },
    },
  ],
};

export default function DigitalMarketingPage() {
  return (
    <main className="flex min-h-screen flex-col bg-[#0a0a0a]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(PERSON_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(PROFESSIONAL_SERVICE_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <Navbar />

      <div className="relative z-10 mx-auto w-full max-w-4xl px-6 sm:px-8 py-24">

        <div className="flex items-center gap-4 mb-8 h-4">
          <span className="h-[2px] w-10 shrink-0 bg-gradient-to-r from-transparent to-primary -translate-y-[7px]" aria-hidden="true" />
          <p className="text-xs font-semibold tracking-[0.18em] uppercase gold-text leading-none whitespace-nowrap">
            Expertise
          </p>
          <span className="h-[2px] w-10 shrink-0 bg-gradient-to-l from-transparent to-primary -translate-y-[7px]" aria-hidden="true" />
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-4">
          Digital Marketing{" "}
          <span className="gold-text">| All Channels, AI-Enhanced</span>
        </h1>
        <p className="text-[#ADB7BE] text-lg mb-16 max-w-2xl">
          Digital marketing works when the channels compound each other. SEO builds the
          organic base. Paid search adds volume. Email and CRM automation converts leads
          that would otherwise go cold. AI search optimisation covers the growing share
          of searches answered before anyone clicks. This is the full system, not a
          single-channel agency retainer.
        </p>

        <section className="mt-12" aria-labelledby="q1">
          <h2 id="q1" className="text-2xl sm:text-3xl font-bold text-white mb-5 border-l-4 border-[#ffb700] pl-4">
            What a digital marketing consultant does
          </h2>
          <div className="space-y-4 text-[#ADB7BE] text-lg leading-relaxed">
            <p>
              A digital marketing consultant develops and executes strategy across the
              channels that drive revenue for a specific business: search, paid
              advertising, email, content, and automation. The emphasis is on the
              channels that match the business model and budget, not the ones that are
              fashionable. For most UK small and medium businesses, that means local SEO
              and Google Business Profile as the foundation, with paid search for
              immediate volume, email automation for follow-up, and AI search
              optimisation for the growing proportion of searches answered by ChatGPT,
              Gemini, and Perplexity.
            </p>
            <p>
              The difference from a digital marketing agency is coherence and
              accountability. With a consultant, the strategy and the execution are held
              by the same person. There is no account manager translating between the
              brief and the delivery team. Work moves faster, strategy stays coherent,
              and the person responsible for results is the person doing the work.
            </p>
          </div>
        </section>

        <section className="mt-12" aria-labelledby="channels-heading">
          <h2 id="channels-heading" className="text-2xl sm:text-3xl font-bold text-white mb-5 border-l-4 border-[#ffb700] pl-4">
            Channels covered
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              ["SEO and local SEO", "Technical SEO, Google Business Profile, local citations, programmatic location pages. The foundation of organic visibility."],
              ["AI search optimisation", "AEO and GEO: entity signals and structured content that get cited in ChatGPT, Gemini, Perplexity, and AI Overviews."],
              ["Paid search", "Google Ads managed through the Ads API -- programmatic control, custom bidding, lower cost per lead."],
              ["Email and lead nurturing", "Automated sequences that follow up every enquiry until the prospect books or declines."],
              ["CRM automation", "Capture, qualify, route, and report on every lead without manual intervention."],
              ["Content and AI content", "Content strategy and AI-assisted production structured for search intent and AI search visibility."],
            ].map(([title, body]) => (
              <div key={title} className="bg-[#1a1a1a] border border-[#ffb700]/20 rounded-xl p-5">
                <p className="text-[#ffb700] font-semibold text-sm mb-2">{title}</p>
                <p className="text-[#ADB7BE] text-sm leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12" aria-labelledby="q3">
          <h2 id="q3" className="text-2xl sm:text-3xl font-bold text-white mb-5 border-l-4 border-[#ffb700] pl-4">
            How AI changes digital marketing
          </h2>
          <div className="space-y-4 text-[#ADB7BE] text-lg leading-relaxed">
            <p>
              AI changes digital marketing in two directions simultaneously. On the
              visibility side, search is shifting from ten blue links to AI-generated
              answers in ChatGPT, Gemini, Perplexity, and Google AI Overviews.
              Businesses that are not structured for these answers are invisible to a
              growing proportion of searchers, regardless of their traditional Google
              rankings.
            </p>
            <p>
              On the operations side, AI agents can handle lead response,
              qualification, follow-up, and CRM updates that previously required staff
              time. The businesses that combine both -- AI-enhanced visibility and
              AI-handled operations -- have a compounding advantage over those that
              treat them separately or ignore one entirely.
            </p>
          </div>
        </section>

        <section className="mt-12" aria-labelledby="results-heading">
          <h2 id="results-heading" className="text-2xl sm:text-3xl font-bold text-white mb-5 border-l-4 border-[#ffb700] pl-4">
            Documented results
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-[#1a1a1a] border border-[#ffb700]/20 rounded-2xl p-8">
              <p className="text-[#ffb700] text-xs font-bold uppercase tracking-widest mb-3">Upgrade Roofing Solutions</p>
              <p className="text-white text-4xl font-extrabold mb-2">538%</p>
              <p className="text-[#ADB7BE] text-sm leading-relaxed">Growth in Google Business Profile interactions in 90 days. More than 30 qualified inbound calls in the first two weeks.</p>
            </div>
            <div className="bg-[#1a1a1a] border border-[#ffb700]/20 rounded-2xl p-8">
              <p className="text-[#ffb700] text-xs font-bold uppercase tracking-widest mb-3">City Plaza Abu Dhabi</p>
              <p className="text-white text-4xl font-extrabold mb-2">5X</p>
              <p className="text-[#ADB7BE] text-sm leading-relaxed">Lead volume within 60 days, scaling to approximately 20 qualified enquiries per day at peak.</p>
            </div>
          </div>
        </section>

        <nav className="mt-16 bg-[#1a1a1a] border border-white/10 rounded-2xl p-8" aria-label="Related expertise">
          <p className="text-white font-bold mb-4">Related expertise</p>
          <ul className="space-y-2">
            {[
              { href: "/expertise/ai-implementation", label: "AI implementation -- the full system" },
              { href: "/expertise/seo", label: "SEO specialist" },
              { href: "/expertise/ai-search-optimisation", label: "AI search optimisation -- AEO and GEO" },
              { href: "/expertise/google-ads-api", label: "Google Ads API" },
              { href: "/expertise/marketing-automation", label: "CRM and marketing automation" },
              { href: "/expertise/ai-content-systems", label: "AI content systems" },
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
            Ready to build the full digital marketing system?
          </h2>
          <p className="text-[#ADB7BE] mb-8 max-w-xl mx-auto">
            Book a free 30-minute strategy call. We will identify which channels
            matter most for your business right now and what a coherent multi-channel
            system looks like in practice.
          </p>
          <CTAButton eventLabel="expertise_digital_marketing_cta" caption="No pitch deck. No obligation.">
            Book Your Free Strategy Call
          </CTAButton>
        </div>
      </div>

      <Footer />
    </main>
  );
}
