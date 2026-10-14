"use client";
import React from "react";
import Link from "next/link";
import PageShell from "../components/PageShell";
import PageHero from "../components/ui/PageHero";
import AchievementsSection from "../components/AchievementsSection";
import { Section } from "../components/ui/Section";
import { Container } from "../components/ui/Container";
import Card from "../components/ui/Card";

const categories = [
  "AI Automation",
  "Digital Marketing",
  "Web & App Development",
  "CRM & Sales",
  "Local Business Growth",
  "SME Success"
];

const featuredArticles = [
  {
    title: "They Told You SEO Was Dead. It Didn't Die — It Expanded.",
    slug: "seo-didnt-die-it-expanded",
    excerpt: "SEO now covers four layers: Google rankings, AEO, GEO, and programmatic pages. One discipline, bigger territory. What UK businesses must do across all four right now.",
    category: "SEO Strategy",
    image: "/images/blog/TradesChatBot.png.png"
  },
  {
    title: "Test It Yourself: Ask ChatGPT Who Does SEO in Your Area.",
    slug: "test-yourself-chatgpt-seo",
    excerpt: "Open ChatGPT, Gemini, and Perplexity. Type your service and city. See who appears. This two-minute test reveals your AI visibility score.",
    category: "AI Search",
    image: "/images/blog/TradesChatBot.png.png"
  },
  {
    title: "Within Five Years, an AI Agent Will Be as Standard as a Phone Number.",
    slug: "ai-agent-standard-as-phone-number",
    excerpt: "Businesses once resisted websites. Then Google profiles. AI agents are the same adoption curve, moving faster. What early adopters gain now vs what late movers will pay.",
    category: "AI Automation",
    image: "/images/blog/TradesChatBot.png.png"
  },
  {
    title: "The Real Ceiling on Your WordPress Site (And When It Actually Matters)",
    slug: "wordpress-real-ceiling",
    excerpt: "WordPress can rank. But plugin-heavy themed builds hit Core Web Vitals, speed, and programmatic-scale ceilings. Here is exactly when it matters and when it does not.",
    category: "Platform Limits",
    image: "/images/blog/SMEs.png.png"
  },
  {
    title: "Shopify Is Built to Sell Products. That's Exactly Why It Struggles at Local SEO.",
    slug: "shopify-local-seo-limits",
    excerpt: "Rigid URL architecture, limited page control, canonical issues with faceted nav. A fair technical assessment of where Shopify wins and where it stops.",
    category: "Platform Limits",
    image: "/images/blog/SMEs.png.png"
  },
  {
    title: "Wix in 2026: Better Than Its Reputation, Still Behind the Ceiling.",
    slug: "wix-2026-honest-review",
    excerpt: "Wix has improved: faster loads, better schema, decent Core Web Vitals on simple sites. It still hits limits on URL structure, programmatic pages, and AI crawling.",
    category: "Platform Limits",
    image: "/images/blog/SMEs.png.png"
  },
  {
    title: "How AI Chatbots Save UK Trades 20+ Hours a Week",
    slug: "ai-chatbots-save-uk-trades",
    excerpt: "Discover how local trades automate admin, boost lead conversion, and reclaim time using AI chatbots.",
    category: "AI Automation",
    image: "/images/blog/TradesChatBot.png.png"
  }
];

export default function BlogHome() {
  return (
    <PageShell>
      {/* Same wrapper the rest of the site uses: one Section, one Container. The hub keeps
          the `main` container width because it is a two-column index, not a prose page. */}
      <Section className="mt-0 pb-ds-4 page-top">
        <Container size="main" className="flex flex-col md:flex-row flex-wrap gap-ds-4">
        {/* Main content */}
        <PageHero title="Resource Hub" className="w-full" />

        {/* The trust strip that sits under the hero on the homepage. */}
        <AchievementsSection />
        <div className="flex-1">
          <div className="flex gap-2 mb-8 flex-wrap">
            {categories.map(cat => (
              <button key={cat} className="px-4 py-2 rounded-full bg-[#181818] border border-[#222] gold-text font-semibold hover:bg-[#222] transition text-sm mb-2">
                {cat}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {featuredArticles.map((article, index) => (
              <Card key={article.slug} as={Link} href={`/blog/${article.slug}`} className="reveal group block overflow-hidden !p-0 hover:scale-[1.02] transition" style={{ "--rv-delay": `${index * 110}ms` }}>
                <img src={article.image} alt={article.title} className="w-full h-48 object-cover group-hover:opacity-90" />
                <div className="p-6">
                  <span className="text-xs font-bold gold-text uppercase mb-2 block">{article.category}</span>
                  <h2 className="text-2xl font-bold mb-2 text-white group-hover:gold-text">{article.title}</h2>
                  <p className="text-muted mb-4">{article.excerpt}</p>
                  <span className="inline-block gold-text font-semibold">Read More →</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
        {/* Sidebar CTA & Lead Magnet */}
        <aside className="w-full md:w-80 flex-shrink-0">
          <Card className="sticky top-24 mb-8 reveal" style={{ "--rv-delay": "200ms" }}>
            <h3 className="text-xl font-bold mb-2 text-white">Want More ROI?</h3>
            <p className="text-muted mb-4">Get my free guide: <span className="gold-text font-semibold">"7 AI Tools Every UK Business Needs in 2025"</span></p>
            <form className="flex flex-col gap-3">
              <input type="email" placeholder="Your Email" className="rounded-lg px-4 py-2 bg-surface border border-[#222] text-white placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary" required />
              <button type="submit" className="bg-primary text-[#222] font-bold py-2 px-6 rounded-lg shadow hover:bg-primary-hover transition border-2 border-primary focus:outline-none focus:ring-2 focus:ring-primary">Get the Free Guide</button>
              <div className="text-center text-xs text-white/70">
                Designed for teams who want proven frameworks — not generic advice.
              </div>
            </form>
          </Card>
          <Card className="reveal" style={{ "--rv-delay": "310ms" }}>
            <h4 className="text-lg font-semibold mb-2 text-white">Book a Consultation</h4>
            <p className="text-muted mb-4">See how AI and automation can grow your UK business.</p>
            <a href="#contact" className="inline-block bg-primary text-[#222] font-bold py-2 px-6 rounded-lg shadow hover:bg-primary-hover transition border-2 border-primary focus:outline-none focus:ring-2 focus:ring-primary">Book a Consultation</a>
            <div className="mt-2 text-center text-xs text-white/70">
              Designed for businesses ready to simplify operations and scale intelligently.
            </div>
          </Card>
        </aside>
        </Container>
      </Section>
    </PageShell>
  );
}
