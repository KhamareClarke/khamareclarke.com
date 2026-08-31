"use client";
import React, { useState } from "react";
import Link from "next/link";
import CTAButton from "./CTAButton";
import { Badge } from "./ui/Badge";

const blogPosts = [
  {
    title: "Analytics That Actually Gets Used",
    slug: "advanced-analytics-growth",
    excerpt: "How a proper reporting setup replaced spreadsheets nobody looked at, and what changed once the numbers were easy to see.",
    category: "Advanced Analytics",
    image: "/images/blog/unlock.png"
  },
  {
    title: "The AI Receptionist, Explained",
    slug: "ai-chatbots-save-uk-trades",
    excerpt: "What actually happens when an AI handles your calls and enquiries, built for a real business, not a demo.",
    category: "AI Automation",
    image: "/images/blog/TradesChatBot.png.png"
  },
  {
    title: "Built to Answer Everything, Everywhere",
    slug: "ai-customer-enquiries-retail",
    excerpt: "How one system handles enquiries across phone, form, and chat without dropping any of them, and what it took to get there.",
    category: "AI Automation",
    image: "/images/blog/automate.png"
  },
  {
    title: "Web Application Engineering: High-Performance Architecture built for Conversion",
    slug: "roi-websites-uk-smes",
    excerpt: "My technical guide to building fast, well-engineered web systems. Discover how sub-second page rendering, headless architectures, and clean technical code drive real, measured business outcomes.",
    category: "Web & App Development",
    image: "/images/blog/SMEs.png.png"
  }
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

  const total = blogPosts.length;
  const maxPage = Math.max(1, Math.ceil(total / visible));
  const goTo = idx => setCurrent((idx + maxPage) % maxPage);

  const start = current * visible;
  const end = start + visible;
  const postsToShow = blogPosts.slice(start, end);

  return (
    <section className="text-white py-12 md:py-16" id="resources">
      <div className="container mx-auto px-4">
        <div className="mb-8 mt-2 text-center">
          <Badge variant="outline" className="mb-6">Resources</Badge>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-3 leading-tight text-white">Field notes from the work</h2>
          <div className="text-[#ADB7BE] max-w-2xl mx-auto text-base">Write-ups and videos from live implementations, what worked, with the numbers behind it.</div>
        </div>
        <div className="relative flex items-center justify-center">
          <button
            aria-label="Previous blog"
            onClick={() => goTo(current - 1)}
            className="absolute left-0 z-10 bg-surface-muted border border-white/10 hover:border-[#ffb700] text-[#ffb700] rounded-lg w-10 h-10 flex items-center justify-center transition-colors md:-left-12"
          >
            &#8592;
          </button>
          <div className={`w-full grid gap-8 mx-auto`} style={{gridTemplateColumns: `repeat(${visible}, minmax(0, 1fr))`, maxWidth: visible === 1 ? '22rem' : visible === 2 ? '48rem' : '72rem'}}>
            {postsToShow.map(post => (
              <div key={post.slug} className="group bg-surface-muted border border-white/10 rounded-lg overflow-hidden flex flex-col">
                <div className="relative w-full aspect-square bg-surface border-b border-white/10 flex items-center justify-center overflow-hidden">
                  {post.image ? (
                    <div
                      className="absolute inset-0 w-full h-full"
                      style={{ background: `url(${post.image})`, backgroundSize: "cover", backgroundPosition: "center" }}
                    />
                  ) : (
                    <div className="absolute inset-0 w-full h-full bg-surface-muted flex items-center justify-center">
                      <span className="text-3xl opacity-30 text-white">{post.category.slice(0, 1)}</span>
                    </div>
                  )}
                  <span className="absolute top-4 left-4 bg-primary text-[#111015] text-xs font-bold px-3 py-1 rounded-full z-10">
                    {post.category}
                  </span>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-xl font-bold mb-2 text-white">{post.title}</h3>
                  <p className="text-[#ADB7BE] mb-6 text-sm">{post.excerpt}</p>
                  <div className="mt-auto">
                    <CTAButton
                      href={`/blog/${post.slug}`}
                      eventLabel={`blog_read_${post.slug}`}
                      icon="arrow"
                      caption="Practical playbooks, not theory."
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
            className="absolute right-0 z-10 bg-surface-muted border border-white/10 hover:border-[#ffb700] text-[#ffb700] rounded-lg w-10 h-10 flex items-center justify-center transition-colors md:-right-12"
          >
            &#8594;
          </button>
        </div>
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: total }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => goTo(idx)}
              className={`w-2.5 h-2.5 rounded-full border border-[#ffb700] ${idx === current ? 'bg-[#ffb700]' : 'bg-transparent'}`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
        <div className="mt-8">
          <CTAButton
            href="/blog"
            eventLabel="blog_view_all"
            caption="Actionable insights on demand."
          >
            View All Resources
          </CTAButton>
        </div>
      </div>
    </section>
  );
}
