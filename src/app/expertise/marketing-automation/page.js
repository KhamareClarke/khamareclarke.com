// src/app/expertise/marketing-automation/page.js

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Link from "next/link";
import CTAButton from "../../components/CTAButton";
import { PERSON_SCHEMA, PROFESSIONAL_SERVICE_SCHEMA } from "../../../lib/schema";

export const metadata = {
  title: "CRM and Marketing Automation UK | Khamare Clarke | Stoke-on-Trent",
  description:
    "CRM setup and marketing automation for UK businesses. Every lead captured, followed up, and reported on without manual intervention. No platform lock-in. Serving the whole of the UK from Stoke-on-Trent.",
  alternates: { canonical: "https://khamareclarke.com/expertise/marketing-automation" },
  openGraph: {
    title: "CRM and Marketing Automation UK | Khamare Clarke",
    description:
      "CRM setup and marketing automation for UK businesses. Every lead captured, followed up, and reported on without manual intervention.",
    url: "https://khamareclarke.com/expertise/marketing-automation",
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
      name: "What is marketing automation?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Marketing automation is the use of software to perform follow-up, lead nurturing, and customer communication tasks that would otherwise require manual effort. At its most effective, it means that every new enquiry receives an immediate response, is qualified without a human making a phone call, is followed up at the right intervals, and is logged and reported automatically. The business owner sees the results -- who enquired, what happened, what was booked -- without managing each step individually.",
      },
    },
    {
      "@type": "Question",
      name: "What is the difference between a CRM and marketing automation?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A CRM (customer relationship management system) is the database: it stores contact records, tracks interactions, and records the status of every lead and customer. Marketing automation is the engine that acts on that data: sending emails, triggering follow-up sequences, routing leads to the right team member, and updating records when actions are taken. The two work together. A CRM without automation is a manual filing system. Automation without a CRM has no context to act on. Both need to be set up correctly from the start.",
      },
    },
    {
      "@type": "Question",
      name: "Why do most CRM implementations fail?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Most CRM implementations fail because the system is installed but not configured for the business's actual workflow, the team is not trained to use it consistently, and no one builds the automations that make it valuable. The result is a database that gets filled with data no one looks at, and follow-up that still happens manually or not at all. Implementation here means the system is built around what the business actually does: how enquiries arrive, what information needs to be captured, what happens next, and how the result is reported.",
      },
    },
    {
      "@type": "Question",
      name: "What does marketing automation cover for a UK small business?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "For a typical UK small or medium business, marketing automation covers: immediate auto-response to every web form, email, or social media enquiry; qualification sequences that ask the right questions before a sales call; follow-up sequences for leads that went quiet; email campaigns to existing customers for repeat work and referrals; booking and appointment reminders that reduce no-shows; and lead source reporting that shows which channels are producing results. All of this runs automatically once it is set up correctly.",
      },
    },
  ],
};

export default function MarketingAutomationPage() {
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
          CRM and Marketing Automation{" "}
          <span className="gold-text">| Every Lead Followed Up, Automatically</span>
        </h1>
        <p className="text-[#ADB7BE] text-lg mb-16 max-w-2xl">
          Most businesses lose more leads to poor follow-up than to poor marketing.
          A new enquiry that is not responded to within minutes is a lead your competitor
          will close. CRM and marketing automation means every enquiry is captured,
          responded to, and followed up -- without requiring a person to remember to do it.
        </p>

        <section className="mt-12" aria-labelledby="q1">
          <h2 id="q1" className="text-2xl sm:text-3xl font-bold text-white mb-5 border-l-4 border-[#ffb700] pl-4">
            What marketing automation actually does
          </h2>
          <div className="space-y-4 text-[#ADB7BE] text-lg leading-relaxed">
            <p>
              Marketing automation performs the follow-up, qualification, and nurturing
              work that would otherwise require manual effort or simply not happen.
              The moment a prospect submits a form, sends an email, or messages through
              any channel, the system responds -- immediately, correctly, and consistently.
              It does not have off-days. It does not forget.
            </p>
            <p>
              For most UK businesses, the single highest-return automation is the
              immediate lead response: a message that acknowledges the enquiry, sets
              expectations, and asks a qualifying question -- sent within two minutes of
              the enquiry arriving, at any time of day or night. That alone converts
              significantly more leads than a business relying on manual callback.
            </p>
          </div>
        </section>

        <section className="mt-12" aria-labelledby="what-is-covered">
          <h2 id="what-is-covered" className="text-2xl sm:text-3xl font-bold text-white mb-5 border-l-4 border-[#ffb700] pl-4">
            What the system covers
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              ["Lead capture and routing", "Every enquiry from every channel -- web form, phone, email, social -- captured in one place and routed to the right person or sequence automatically."],
              ["Immediate response automation", "Auto-response within minutes of every new enquiry, personalised to the channel and query type, with a qualifying question built in."],
              ["Follow-up sequences", "Leads that went quiet are followed up at day 2, day 5, and day 14 without manual action -- the sequence stops the moment they reply or book."],
              ["Email campaigns", "Campaigns to past customers and warm contacts: re-engagement, seasonal offers, referral requests -- built once, runs continuously."],
              ["Booking and appointment flow", "Automated confirmations, reminders, and no-show follow-up that reduce wasted appointment slots."],
              ["Lead source reporting", "Every closed deal traced back to the channel that generated it -- so marketing budget goes where it produces returns."],
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
            Why most CRM implementations fail
          </h2>
          <div className="space-y-4 text-[#ADB7BE] text-lg leading-relaxed">
            <p>
              Most CRM implementations fail because the system is installed but not
              configured for the business's actual workflow. The team is not trained to
              use it consistently. No one builds the automations that make it valuable.
              The result is a database that accumulates data no one looks at, and
              follow-up that still happens manually -- or does not happen at all.
            </p>
            <p>
              Implementation here means building the system around what the business
              actually does: how enquiries arrive, what information needs to be
              captured, what happens next at each stage, and how the result is reported
              to the business owner without requiring them to log in to interpret a
              dashboard. It is set up, tested against real enquiries, and handed over
              with the team trained to use it.
            </p>
          </div>
        </section>

        <section className="mt-12" aria-labelledby="q4">
          <h2 id="q4" className="text-2xl sm:text-3xl font-bold text-white mb-5 border-l-4 border-[#ffb700] pl-4">
            How it connects to the wider system
          </h2>
          <div className="space-y-4 text-[#ADB7BE] text-lg leading-relaxed">
            <p>
              CRM and marketing automation works best as part of a joined-up system.
              The website generates enquiries that land in the CRM. The AI receptionist
              responds and qualifies leads before a human is needed. Email campaigns
              convert past customers into repeat work. Google Ads and SEO drive the
              volume that the automation converts.
            </p>
            <p>
              Standalone, a well-built automation system still produces a measurable
              improvement: fewer cold leads, faster response times, more consistent
              follow-up. As part of a broader implementation, it compounds the return
              from every other channel.
            </p>
          </div>
        </section>

        <nav className="mt-16 bg-[#1a1a1a] border border-white/10 rounded-2xl p-8" aria-label="Related expertise">
          <p className="text-white font-bold mb-4">Related expertise</p>
          <ul className="space-y-2">
            {[
              { href: "/expertise/ai-implementation", label: "AI implementation -- the full system" },
              { href: "/expertise/ai-agents", label: "AI agents and AI receptionists for UK businesses" },
              { href: "/expertise/digital-marketing", label: "Digital marketing" },
              { href: "/expertise/seo", label: "SEO specialist" },
              { href: "/expertise/google-ads-api", label: "Google Ads API" },
              { href: "/expertise/ai-content-systems", label: "AI content systems" },
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
            Ready to stop losing leads to slow follow-up?
          </h2>
          <p className="text-[#ADB7BE] mb-8 max-w-xl mx-auto">
            Book a free 30-minute call. We will map your current lead flow,
            identify where enquiries are being lost, and build a system that
            closes that gap automatically.
          </p>
          <CTAButton eventLabel="expertise_marketing_automation_cta" caption="No pitch deck. No obligation.">
            Book Your Free Strategy Call
          </CTAButton>
        </div>
      </div>

      <Footer />
    </main>
  );
}
