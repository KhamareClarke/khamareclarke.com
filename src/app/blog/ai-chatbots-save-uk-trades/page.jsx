import React from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import CTAButton from "../../components/CTAButton";
import { Section } from "../../components/ui/Section";
import { Container } from "../../components/ui/Container";

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
    <main className="flex min-h-screen flex-col bg-[#0a0a0a]">
      <Navbar />
      <Section className="py-ds-6 bg-[#0A0A0A] text-white">
        <Container size="narrow">
      <article className="text-white">
        <img src="/images/blog/TradesChatBot.png.png" alt="AI chatbot helping UK tradespeople save time" className="w-full rounded-xl mb-8 border border-[#222]" />
        <h1 className="text-4xl font-extrabold mb-4 text-[#ffb700]">How AI Chatbots Save UK Trades 20+ Hours a Week</h1>
        <div className="mb-6 text-[#ADB7BE] text-sm">Category: AI Automation · ROI for Local Business · August 2025</div>
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-2 text-white">The Problem</h2>
          <p className="text-[#ADB7BE]">Manual admin, missed leads, and constant phone calls eat up valuable hours for UK trades. Most small businesses lose 1–2 days a week to paperwork and chasing clients.</p>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-2 text-white">The AI Solution</h2>
          <p className="text-[#ADB7BE]">AI chatbots can handle lead qualification, appointment booking, and customer queries 24/7. Integrated with WhatsApp, web chat, or SMS, they automate the entire process-no more lost leads or late-night admin.</p>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-2 text-white">The ROI</h2>
          <ul className="list-disc pl-6 text-[#ADB7BE]">
            <li>Average UK trade saves 20+ hours/month on admin</li>
            <li>40% more leads converted (no more missed calls)</li>
            <li>Instant responses boost customer satisfaction & reviews</li>
            <li>Payback in under 2 months for most SMEs</li>
          </ul>
        </section>
        <section className="mb-12">
          <CTAButton caption="Designed for trades and local businesses ready to automate enquiries and stop losing leads.">Book Your Free Strategy Call</CTAButton>
        </section>
        <aside className="bg-[#181818] border border-[#222] rounded-xl p-6 shadow-lg mb-8">
          <h3 className="text-xl font-bold mb-2 text-white">Download the Free Guide</h3>
          <p className="text-[#ADB7BE] mb-4">7 AI Tools Every UK Business Needs in 2025</p>
          <form className="flex flex-col gap-3">
            <input type="email" placeholder="Your Email" className="rounded-lg px-4 py-2 bg-[#0A0A0A] border border-[#222] text-white placeholder-[#ADB7BE] focus:outline-none focus:ring-2 focus:ring-[#ffb700]" required />
            <button type="submit" className="bg-[#ffb700] text-[#222] font-bold py-2 px-6 rounded-lg shadow hover:bg-[#e6a600] transition border-2 border-[#ffb700] focus:outline-none focus:ring-2 focus:ring-[#ffb700]">Get the Free Guide</button>
          </form>
        </aside>
      </article>
        </Container>
      </Section>
      <Footer />
    </main>
  );
}
