"use client";
import React, { useState } from "react";
import Link from "next/link";
import CTAButton from "./CTAButton";

const categoryEmojis = {
  'AI Automation': '🤖',
  'Web & App Development': '💻',
  'Advanced Analytics': '📊'
};

const categoryGradients = {
  'AI Automation': 'from-[#312e81] via-[#1e1b4b] to-[#0f172a]',
  'Web & App Development': 'from-[#064e3b] via-[#065f46] to-[#0f172a]',
  'Advanced Analytics': 'from-[#78350f] via-[#92400e] to-[#0f172a]',
};

const blogPosts = [
  {
    title: "How I Help UK Trades Save 20+ Hours a Week with AI Chatbots",
    slug: "ai-chatbots-save-uk-trades",
    excerpt: "I design and build custom AI chatbots that automate admin, boost lead conversion, and give UK tradespeople their time back. Discover my hands-on approach and proven results.",
    category: "AI Automation",
    image: "/images/blog/TradesChatBot.png.png"
  },
  {
    title: "How I Build ROI-Driven Websites for UK SMEs",
    slug: "roi-websites-uk-smes",
    excerpt: "My practical, expert guide to building websites that deliver real business results for local UK companies. See how I use modern web tech to drive ROI for my clients.",
    category: "Web & App Development",
    image: "/images/blog/SMEs.png.png"
  },
  // Add up to 10 personalized blog posts here...
  {
    title: "How I Automate Customer Enquiries 24/7 for UK Retailers with AI",
    slug: "ai-customer-enquiries-retail",
    excerpt: "I deploy AI chatbots that automate support and boost customer satisfaction for UK retailers. Learn how my expert systems deliver results around the clock.",
    category: "AI Automation",
    image: "/images/blog/automate.png"
  },
  {
    title: "Driving Growth with Advanced Analytics",
    slug: "advanced-analytics-growth",
    excerpt: "Discover how advanced analytics and data-driven strategies help UK businesses make smarter decisions, optimise operations, and drive measurable growth.",
    category: "Advanced Analytics",
    image: "/images/blog/unlock.png"
  }
  // ...more posts
];

export default function BlogSlider() {
  const [current, setCurrent] = useState(0);
  // Responsive: 1 card (mobile), 2 (tablet), 3 (desktop)
  const getVisible = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth >= 1024) return 3;
      if (window.innerWidth >= 640) return 2;
    }
    return 1;
  };

  const [visible, setVisible] = useState(1); // Start with mobile to avoid hydration mismatch
  
  React.useEffect(() => {
    // Set correct visible count after mount
    setVisible(getVisible());
    
    const handleResize = () => setVisible(getVisible());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const total = Math.min(blogPosts.length, 10);
  const maxPage = Math.ceil(total / visible);
  const goTo = idx => setCurrent((idx + maxPage) % maxPage);

  const start = current * visible;
  const end = start + visible;
  const postsToShow = blogPosts.slice(start, end);

  return (
    <section className="text-white py-12 md:py-16" id="resources">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center mb-8 mt-2 w-full text-center">
          <span className="bg-transparent border border-[#ffb700] text-[#ffb700] text-xs font-semibold px-4 py-1 rounded-full mb-3 tracking-widest uppercase">RESOURCES</span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-2 text-transparent bg-clip-text bg-gradient-to-r from-[#ffb700] to-[#ff8c00]">Field Notes From a Working SEO and AI Builder</h2>
          <div className="text-[#ADB7BE] max-w-2xl mx-auto text-base font-normal">Write-ups from live client campaigns. What worked, with the numbers.</div>
        </div>
        <div className="relative flex items-center justify-center">
          <button
            aria-label="Previous blog"
            onClick={() => goTo(current - 1)}
            className="absolute left-0 z-10 bg-[#1a1a1a]/90 backdrop-blur-sm border-2 border-[#ffb700]/30 hover:border-[#ffb700] text-[#ffb700] rounded-full w-10 h-10 flex items-center justify-center hover:scale-110 transition-all duration-300 shadow-lg md:-left-12"
          >
            &#8592;
          </button>
          <div className={`w-full grid gap-8 mx-auto`} style={{gridTemplateColumns: `repeat(${visible}, minmax(0, 1fr))`, maxWidth: visible === 1 ? '22rem' : visible === 2 ? '48rem' : '72rem'}}>
            {postsToShow.map(post => (
              <div key={post.slug} className="group bg-[#1a1a1a]/90 backdrop-blur-sm rounded-2xl overflow-hidden border-2 border-[#ffb700]/20 hover:border-[#ffb700]/40 shadow-2xl motion-safe:hover:scale-[1.03] motion-safe:hover:shadow-[0_0_24px_rgba(255,183,0,0.18)] transition-all duration-300 flex flex-col">
                <div className="relative">
                  <div className={`w-full h-48 bg-gradient-to-br ${categoryGradients[post.category] || 'from-[#1a1a1a] to-[#0f172a]'} flex items-center justify-center`}>
                    <span className="text-5xl opacity-30">{categoryEmojis[post.category] || '📝'}</span>
                  </div>
                  <span className="absolute top-4 left-4 bg-[#ffb700] text-[#222] text-xs font-bold px-3 py-1 rounded-full shadow flex items-center gap-1">
                    <span>{categoryEmojis[post.category] || '📝'}</span>
                    <span>{post.category}</span>
                  </span>
                  <span className="absolute top-4 right-4 bg-[#111015] text-[#ffb700] text-xs font-bold px-2 py-1 rounded shadow flex items-center gap-1">
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#ffb700"/><text x="12" y="16" textAnchor="middle" fontSize="12" fill="#111015" fontWeight="bold">KC</text></svg>
                    Khamare Clarke
                  </span>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-2xl font-bold mb-2 text-white group-hover:text-[#ffb700]">{post.title}</h3>
                  <p className="text-[#ADB7BE] mb-6 text-base">{post.excerpt}</p>
                  <div className="mt-auto flex items-center justify-between">
                    <CTAButton
                      href={`/blog/${post.slug}`}
                      className="px-6 py-2 text-sm bg-gradient-to-r from-[#ffb700] to-[#ff8c00] text-[#222] hover:from-[#ff8c00] hover:to-[#ffb700] border-2 border-[#ffb700] focus:ring-[#ffb700]"
                      icon="arrow"
                      caption="Designed for teams who want practical playbooks, not theory."
                    >
                      Read Article
                    </CTAButton>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button
            aria-label="Next blog"
            onClick={() => goTo(current + 1)}
            className="absolute right-0 z-10 bg-[#1a1a1a]/90 backdrop-blur-sm border-2 border-[#ffb700]/30 hover:border-[#ffb700] text-[#ffb700] rounded-full w-10 h-10 flex items-center justify-center hover:scale-110 transition-all duration-300 shadow-lg md:-right-12"
          >
            &#8594;
          </button>
        </div>
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: total }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => goTo(idx)}
              className={`w-3 h-3 rounded-full border border-[#ffb700] ${idx === current ? 'bg-[#ffb700]' : 'bg-[#181818]'}`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
        <div className="text-center mt-8">
          <CTAButton
            href="/blog"
            className="px-8 py-3 text-lg"
            icon="folder"
            caption="Designed for builders who want actionable insights on demand."
          >
            View All Resources
          </CTAButton>
        </div>
      </div>
    </section>
  );
}
