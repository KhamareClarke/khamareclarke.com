"use client";
import React, { useState } from "react";
import Link from "next/link";
import CTAButton from "./CTAButton";

const blogPosts = [
  {
    title: "Analytics That Actually Gets Used",
    slug: "advanced-analytics-growth",
    caption: "See the numbers, not the vanity.",
    excerpt: "How a proper reporting setup replaced spreadsheets nobody looked at and what changed once the numbers were easy to see.",
    category: "Advanced Analytics",
    image: "/images/blog/unlock.png"
  },
  {
    title: "The AI Receptionist, Explained",
    slug: "ai-chatbots-save-uk-trades",
    caption: "What it sounds like on a real call.",
    excerpt: "What actually happens when an AI handles your calls and enquiries, built for a real business, not a demo.",
    category: "AI Automation",
    image: "/images/blog/TradesChatBot.png.png"
  },
  {
    title: "Built to Answer Everything, Everywhere",
    slug: "ai-customer-enquiries-retail",
    caption: "How nothing gets dropped.",
    excerpt: "How one system handles enquiries across phone, form and chat without dropping any of them and what it took to get there.",
    category: "AI Automation",
    image: "/images/blog/automate.png"
  },
  {
    title: "Web Application Engineering: High-Performance Architecture built for Conversion",
    slug: "roi-websites-uk-smes",
    caption: "What high performance costs to build.",
    excerpt: "My technical guide to building fast, well-engineered web systems. Discover how sub-second page rendering, headless architectures and clean technical code drive real, measured business outcomes.",
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
    <section className="text-white py-16 md:py-20 lg:py-24" id="resources">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 mt-2 text-center">
          <h2 className="reveal ds-heading-2 text-white mb-4" style={{ "--rv-delay": "120ms" }}>Field notes from the work</h2>
          <div className="reveal ds-lede text-[#ADB7BE] mx-auto" style={{ "--rv-delay": "200ms" }}>Write-ups and videos from live implementations, what worked, with the numbers behind it.</div>
        </div>
        <div className="relative flex items-center justify-center">
          <button
            aria-label="Previous blog"
            onClick={() => goTo(current - 1)}
            className="absolute left-0 z-10 bg-surface-muted border border-white/10 hover:border-[#ffb700] text-[#ffb700] rounded-lg w-10 h-10 flex items-center justify-center transition-colors md:-left-12"
          >
            &#8592;
          </button>
          {/* Reveal sits on the GRID, not on each card. The cards carry their own
              `transition-transform ... hover:-translate-y-1`; the reveal rule is more
              specific and would replace that transition, turning a 300ms hover lift
              into a 900ms one. The grid has no hover of its own, so it is safe here. */}
          <div className={`reveal w-full grid gap-8 mx-auto`} style={{gridTemplateColumns: `repeat(${visible}, minmax(0, 1fr))`, maxWidth: visible === 1 ? '22rem' : visible === 2 ? '48rem' : '72rem', "--rv-delay": "280ms"}}>
            {postsToShow.map(post => (
              <div key={post.slug} className="group bg-surface-muted border border-white/10 rounded-lg overflow-hidden flex flex-col transition-transform duration-300 ease-out hover:-translate-y-1">
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
                  <span className="gold-chip absolute top-4 left-4 text-[#111015] text-[13px] font-bold px-3 py-1 rounded-full z-10">
                    {post.category}
                  </span>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-lg font-bold mb-2 text-white">{post.title}</h3>
                  <p className="text-[#ADB7BE] mb-6 text-base">{post.excerpt}</p>
                  <div className="mt-auto">
                    <CTAButton
                      href={`/blog/${post.slug}`}
                      eventLabel={`blog_read_${post.slug}`}
                      icon="arrow"
                      caption={post.caption || "Practical playbooks, not theory."}
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
        <div className="reveal mt-8 text-center" style={{ "--rv-delay": "380ms" }}>
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
