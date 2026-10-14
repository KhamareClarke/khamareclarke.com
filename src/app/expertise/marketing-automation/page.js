// src/app/expertise/marketing-automation/page.js

import Link from "next/link";
import PageShell from "../../components/PageShell";
import PageHero from "../../components/ui/PageHero";
import AchievementsSection from "../../components/AchievementsSection";
import SectionHeading from "../../components/ui/SectionHeading";
import CtaPanel from "../../components/ui/CtaPanel";
import { Section } from "../../components/ui/Section";
import { Container } from "../../components/ui/Container";
import Card from "../../components/ui/Card";
import CTAButton from "../../components/CTAButton";

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
    <PageShell
      schema={
        <>
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
        </>
      }
    >
      <Section className="mt-0 pb-ds-4 page-top">
        <Container size="narrow">
          <PageHero
            eyebrow="Expertise"
            size="compact"
            title={
              <>
                CRM and Marketing Automation{" "}
                <span className="gold-text">| Every Lead Followed Up, Automatically</span>
              </>
            }
          />

          {/* The trust strip that sits under the hero on the homepage. */}
          <AchievementsSection />
          <p className="reveal text-muted text-lg mb-16 max-w-2xl" style={{ "--rv-delay": "200ms" }}>
            Most businesses lose more leads to poor follow-up than to poor marketing.
            A new enquiry that is not responded to within minutes is a lead your competitor
            will close. CRM and marketing automation means every enquiry is captured,
            responded to, and followed up -- without requiring a person to remember to do it.
          </p>

        <section className="mt-12" aria-labelledby="q1">
          <SectionHeading id="q1">
            What <span className="gold-text">marketing automation</span> actually does
          </SectionHeading>
          <div className="space-y-4 text-muted ds-body-lg">
            <p className="reveal" style={{ "--rv-delay": "200ms" }}>
              Marketing automation performs the follow-up, qualification, and nurturing
              work that would otherwise require manual effort or simply not happen.
              The moment a prospect submits a form, sends an email, or messages through
              any channel, the system responds -- immediately, correctly, and consistently.
              It does not have off-days. It does not forget.
            </p>
            <p className="reveal" style={{ "--rv-delay": "280ms" }}>
              For most UK businesses, the single highest-return automation is the
              immediate lead response: a message that acknowledges the enquiry, sets
              expectations, and asks a qualifying question -- sent within two minutes of
              the enquiry arriving, at any time of day or night. That alone converts
              significantly more leads than a business relying on manual callback.
            </p>
          </div>
        </section>

        <section className="mt-12" aria-labelledby="what-is-covered">
          <SectionHeading id="what-is-covered">
            What the <span className="gold-text">system covers</span>
          </SectionHeading>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              ["Lead capture and routing", "Every enquiry from every channel -- web form, phone, email, social -- captured in one place and routed to the right person or sequence automatically."],
              ["Immediate response automation", "Auto-response within minutes of every new enquiry, personalised to the channel and query type, with a qualifying question built in."],
              ["Follow-up sequences", "Leads that went quiet are followed up at day 2, day 5, and day 14 without manual action -- the sequence stops the moment they reply or book."],
              ["Email campaigns", "Campaigns to past customers and warm contacts: re-engagement, seasonal offers, referral requests -- built once, runs continuously."],
              ["Booking and appointment flow", "Automated confirmations, reminders, and no-show follow-up that reduce wasted appointment slots."],
              ["Lead source reporting", "Every closed deal traced back to the channel that generated it -- so marketing budget goes where it produces returns."],
            ].map(([title, body], index) => (
              <Card key={title} className="reveal" style={{ "--rv-delay": `${index * 110}ms` }}>
                <p className="gold-text font-semibold text-sm mb-2">{title}</p>
                <p className="text-muted text-sm leading-relaxed">{body}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="mt-12" aria-labelledby="q3">
          <SectionHeading id="q3">
            Why most <span className="gold-text">CRM implementations</span> fail
          </SectionHeading>
          <div className="space-y-4 text-muted ds-body-lg">
            <p className="reveal" style={{ "--rv-delay": "200ms" }}>
              Most CRM implementations fail because the system is installed but not
              configured for the business's actual workflow. The team is not trained to
              use it consistently. No one builds the automations that make it valuable.
              The result is a database that accumulates data no one looks at, and
              follow-up that still happens manually -- or does not happen at all.
            </p>
            <p className="reveal" style={{ "--rv-delay": "280ms" }}>
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
          <SectionHeading id="q4">
            How it connects to the <span className="gold-text">wider system</span>
          </SectionHeading>
          <div className="space-y-4 text-muted ds-body-lg">
            <p className="reveal" style={{ "--rv-delay": "200ms" }}>
              CRM and marketing automation works best as part of a joined-up system.
              The website generates enquiries that land in the CRM. The AI receptionist
              responds and qualifies leads before a human is needed. Email campaigns
              convert past customers into repeat work. Google Ads and SEO drive the
              volume that the automation converts.
            </p>
            <p className="reveal" style={{ "--rv-delay": "280ms" }}>
              Standalone, a well-built automation system still produces a measurable
              improvement: fewer cold leads, faster response times, more consistent
              follow-up. As part of a broader implementation, it compounds the return
              from every other channel.
            </p>
          </div>
        </section>

        <Card as="nav" aria-label="Related expertise" className="reveal mt-16" style={{ "--rv-delay": "200ms" }}>
          <p className="text-white font-bold mb-4">Related expertise</p>
          <ul className="space-y-2">
            {[
              { href: "/expertise/ai-implementation", label: "AI implementation -- the full system" },
              { href: "/expertise/ai-agents", label: "AI agents and AI receptionists for UK businesses" },
              { href: "/expertise/digital-marketing", label: "Digital marketing" },
              { href: "/expertise/seo", label: "SEO specialist" },
              { href: "/expertise/google-ads-api", label: "Google Ads API" },
              { href: "/expertise/ai-content-systems", label: "AI content systems" },
            ].map((l, index) => (
              <li key={l.href} className="reveal" style={{ "--rv-delay": `${index * 90}ms` }}>
                <Link href={l.href} className="text-muted hover:gold-text transition-colors flex items-center gap-2 text-sm">
                  <span className="gold-text">--</span> {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </Card>

        <CtaPanel headingLevel="h2"
          className="mt-16"
          heading={
            <>
              Ready to stop losing leads to <span className="gold-text">slow follow-up?</span>
            </>
          }
          body="Book a free 30-minute call. We will map your current lead flow, identify where enquiries are being lost, and build a system that closes that gap automatically."
        >
          <CTAButton eventLabel="expertise_marketing_automation_cta" caption="What keeps slipping through, and where it goes.">
            Book a Consultation
          </CTAButton>
        </CtaPanel>
        </Container>
      </Section>
    </PageShell>
  );
}
