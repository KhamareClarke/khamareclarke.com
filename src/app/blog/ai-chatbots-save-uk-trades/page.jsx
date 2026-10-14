import React from "react";
import PageShell from "../../components/PageShell";
import PageHero from "../../components/ui/PageHero";
import AchievementsSection from "../../components/AchievementsSection";
import SectionHeading from "../../components/ui/SectionHeading";
import { Section } from "../../components/ui/Section";
import { Container } from "../../components/ui/Container";
import Card from "../../components/ui/Card";
import CTAButton from "../../components/CTAButton";

export const metadata = {
  title: "How AI Chatbots Save UK Trades 20+ Hours a Week | Resource Hub | REMAKE",
  description: "Discover how local trades automate admin, boost lead conversion, and reclaim time using AI chatbots. Real-world ROI for UK businesses.",
  alternates: { canonical: "https://khamareclarke.com/blog/ai-chatbots-save-uk-trades" },
  openGraph: {
    title: "How AI Chatbots Save UK Trades 20+ Hours a Week",
    description: "Discover how local trades automate admin, boost lead conversion, and reclaim time using AI chatbots. Real-world ROI for UK businesses.",
    url: "https://khamareclarke.com/blog/ai-chatbots-save-uk-trades",
    type: "article",
    images: ["https://khamareclarke.com/images/blog/TradesChatBot.png.png"],
  },
};

export default function BlogPost() {
  return (
    <PageShell>
      <Section className="mt-0 pb-ds-4 page-top">
        <Container size="narrow">
          <article className="text-white">
            <img src="/images/blog/TradesChatBot.png.png" alt="AI chatbot helping UK tradespeople save time" className="reveal-img w-full rounded-xl mb-8 border border-[#222]" style={{ "--rv-delay": "60ms" }} />

            <PageHero
              title="How AI Chatbots Save UK Trades 20+ Hours a Week"
              size="compact"
            />

            {/* The trust strip that sits under the hero on the homepage. */}
            <AchievementsSection />

            <div className="reveal text-muted text-sm mt-6 mb-6" style={{ "--rv-delay": "200ms" }}>Category: AI Automation · ROI for Local Business · August 2025</div>

            <section className="mb-8">
              <SectionHeading>
                The <span className="gold-text">Problem</span>
              </SectionHeading>
              <p className="reveal text-muted" style={{ "--rv-delay": "200ms" }}>Manual admin, missed leads, and constant phone calls eat up valuable hours for UK trades. Most small businesses lose 1–2 days a week to paperwork and chasing clients.</p>
            </section>

            <section className="mb-8">
              <SectionHeading>The AI Solution</SectionHeading>
              <p className="reveal text-muted" style={{ "--rv-delay": "200ms" }}>AI chatbots can handle lead qualification, appointment booking, and customer queries 24/7. Integrated with WhatsApp, web chat, or SMS, they automate the entire process-no more lost leads or late-night admin.</p>
            </section>

            <section className="mb-8">
              <SectionHeading>
                The <span className="gold-text">ROI</span>
              </SectionHeading>
              <ul className="list-disc pl-6 text-muted">
                <li className="reveal" style={{ "--rv-delay": "0ms" }}>Average UK trade saves 20+ hours/month on admin</li>
                <li className="reveal" style={{ "--rv-delay": "90ms" }}>40% more leads converted (no more missed calls)</li>
                <li className="reveal" style={{ "--rv-delay": "180ms" }}>Instant responses boost customer satisfaction & reviews</li>
                <li className="reveal" style={{ "--rv-delay": "270ms" }}>Payback in under 2 months for most SMEs</li>
              </ul>
            </section>

            <section className="mb-12 reveal" style={{ "--rv-delay": "260ms" }}>
              <CTAButton caption="What a chatbot would do for you, and where it helps.">Book a Consultation</CTAButton>
            </section>

            <Card className="reveal mb-8" style={{ "--rv-delay": "200ms" }}>
              <h3 className="text-xl font-bold mb-2 text-white">Download the Free Guide</h3>
              <p className="text-muted mb-4">7 AI Tools Every UK Business Needs in 2025</p>
              <form className="flex flex-col gap-3">
                <input type="email" placeholder="Your Email" className="rounded-lg px-4 py-2 bg-surface border border-[#222] text-white placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary" required />
                <button type="submit" className="bg-primary text-[#222] font-bold py-2 px-6 rounded-lg shadow hover:bg-primary-hover transition border-2 border-primary focus:outline-none focus:ring-2 focus:ring-primary">Get the Free Guide</button>
              </form>
            </Card>
          </article>
        </Container>
      </Section>
    </PageShell>
  );
}
