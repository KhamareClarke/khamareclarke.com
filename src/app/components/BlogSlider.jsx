"use client";
import React, { useState } from "react";
import Link from "next/link";
import CTAButton from "./CTAButton";

// Map categories to emojis
const categoryEmojis = {
  'AI Automation': '🤖',
  'Web & App Development': '💻',
  'Advanced Analytics': '📊'
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
              <div key={post.slug} className="group bg-[#1a1a1a]/90 backdrop-blur-sm rounded-2xl overflow-hidden border-2 border-[#ffb700]/20 hover:border-[#ffb700]/40 shadow-2xl hover:scale-[1.03] transition-all duration-300 flex flex-col">
                <div className="relative">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-48 object-cover rounded-xl mb-4"
                  />
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
        {/* 7-Figure AI Playbook Lead Magnet - Compact Design */}
        <div className="mt-16 mb-8 px-4">
          <div className="max-w-5xl mx-auto">
            {/* Main Container with Gradient Border */}
            <div className="relative bg-gradient-to-r from-[#ffb700] via-[#ff8c00] to-[#ffb700] p-1 rounded-2xl shadow-xl">
              <div className="bg-[#0a0a0a] rounded-2xl overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-3 min-h-[400px]">
                  
                  {/* Left Content Section - 2/3 width */}
                  <div className="lg:col-span-2 p-6 md:p-8 flex flex-col justify-center relative">
                    <div className="relative z-10">
                      {/* Badge */}
                      <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#ffb700] to-[#ff8c00] text-black font-bold py-2 px-4 rounded-full text-xs uppercase tracking-wider shadow-lg mb-6">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        FREE DOWNLOAD
                      </div>
                      
                      {/* Main Headline */}
                      <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-white mb-4 leading-tight">
                        The <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffb700] to-[#ff8c00]">7-Figure AI Playbook</span>
                        <br />
                        <span className="text-xl md:text-2xl text-[#ADB7BE]">for UK Businesses</span>
                      </h2>
                      
                      {/* Value Proposition */}
                      <div className="bg-gradient-to-r from-[#ffb700]/10 to-[#ff8c00]/10 border border-[#ffb700]/20 rounded-xl p-4 mb-6">
                        <p className="text-white text-base md:text-lg font-semibold mb-2">
                          Get the <span className="text-[#ffb700]">exact AI systems</span> used across UK client campaigns
                        </p>
                      </div>
                      
                      {/* Benefits Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                        {[
                          { icon: "✅", text: "7 proven AI workflows (save 20+ hours/week)" },
                          { icon: "✅", text: "Client acquisition systems" },
                          { icon: "✅", text: "Revenue-boosting automations" },
                          { icon: "✅", text: "UK business case studies" }
                        ].map((benefit, index) => (
                          <div key={index} className="flex items-start gap-3 bg-[#1a1a1a]/30 rounded-lg p-3">
                            <div className="text-lg flex-shrink-0">{benefit.icon}</div>
                            <span className="text-white/90 text-sm">{benefit.text}</span>
                          </div>
                        ))}
                      </div>
                      
                      {/* Trust Indicators */}
                      <div className="flex items-center gap-4 text-[#ADB7BE] text-xs">
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>Instant Access</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                          </svg>
                          <span>100% Secure</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>No Spam</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Right Form Section - 1/3 width */}
                  <div className="lg:col-span-1 bg-gradient-to-br from-[#ffb700] via-[#ff8c00] to-[#ffb700] p-6 md:p-8 flex flex-col justify-center relative overflow-hidden">
                    <div className="relative z-10">
                      {/* Form Header */}
                      <div className="text-center mb-6">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl mb-4 shadow-xl">
                          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-1">Get Your Free Copy</h3>
                        <p className="text-white/80 text-sm">Join 10,000+ UK businesses</p>
                      </div>
                      
                      {/* What's Inside Preview */}
                      <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 mb-6 shadow-xl">
                        <h4 className="text-base font-bold text-black mb-3 text-center">What's Inside:</h4>
                        <div className="space-y-2">
                          {[
                            "50+ Page Playbook",
                            "12 AI Templates",
                            "Video Guides",
                            "Bonus Resources"
                          ].map((item, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <span className="text-green-600 text-xs">+</span>
                              <span className="text-black text-xs font-medium">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Form */}
                      <form className="space-y-3">
                        <input 
                          type="text" 
                          placeholder="Your Name" 
                          className="w-full rounded-lg px-4 py-3 text-black bg-white/95 backdrop-blur-sm placeholder-gray-600 font-medium border-2 border-white/20 focus:border-white focus:outline-none transition-all duration-300 shadow-lg text-sm" 
                          required
                        />
                        <input 
                          type="email" 
                          placeholder="Your Email" 
                          className="w-full rounded-lg px-4 py-3 text-black bg-white/95 backdrop-blur-sm placeholder-gray-600 font-medium border-2 border-white/20 focus:border-white focus:outline-none transition-all duration-300 shadow-lg text-sm" 
                          required
                        />
                        
                        <button
                          type="submit"
                          className="w-full bg-black text-white font-bold py-3 px-4 rounded-lg hover:bg-gray-900 transition-all duration-300 flex items-center justify-center gap-2 shadow-xl hover:scale-105 transform text-sm"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                          Get Instant Access
                        </button>
                      </form>
                      
                      <p className="text-white/70 text-xs text-center mt-3">
                        100% secure. No spam.
                      </p>
                    </div>
                  </div>
                  
                </div>
              </div>
            </div>
          </div>
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
