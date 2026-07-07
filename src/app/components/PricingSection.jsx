'use client';

import React, { useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { motion } from "framer-motion";
import CTAButton from "./CTAButton";

const PACKAGE_CATEGORIES = [
  {
    id: "digital-infrastructure",
    label: "Web & App Development",
    description: "",
    icon: "💻",
    tiers: [
      {
        tier: "GET FOUND",
        price: "from £495/mo",
        tagline: "The full system, working for a one-person business.",
        originalPrice: null,
        mostPopular: false,
        cta: "Get Found →",
        deliverables: [
          "AI receptionist answering every enquiry in minutes, 24/7 — even while you're on the tools",
          "CRM installed and run for you: every enquiry captured, tracked, followed up automatically",
          "SEO and AI search (Google, ChatGPT, Gemini, Perplexity): fixes done monthly, done for you",
          "Google Business Profile managed so it produces calls, not views",
          "One plain-English update monthly: rankings, calls, enquiries",
          "The same work that took a roofing firm to 538% profile growth and 30+ calls in two weeks",
        ],
        caption: "from £495/mo · ranked or refunded",
        footnote: "Most clients start here. The system grows as your results do.",
      },
      {
        tier: "RUN THE AREA",
        price: "from £1,250/mo",
        tagline: "The full system, plus the builds that take over your patch.",
        originalPrice: null,
        mostPopular: true,
        cta: "Run The Area →",
        deliverables: [
          "Everything in Get Found at 2x the monthly hours",
          "A new custom website, built to rank and convert — yours to keep",
          "A page for every service, in every area you cover",
          "Email campaigns that turn your old enquiry list into booked work",
          "The same system that scaled a commercial property client to 5X leads in 60 days",
        ],
        caption: "from £1,250/mo · 6-month initial term while your site is built, then rolling monthly · the site is yours",
      },
      {
        tier: "OWN THE MARKET",
        price: "from £2,500/mo",
        tagline: "The full system at maximum firepower. Market number one, on autopilot.",
        originalPrice: null,
        mostPopular: false,
        cta: "Own The Market →",
        deliverables: [
          "Everything above at 4x the hours, builds and campaigns in parallel",
          "Google Ads engineered through code and the Ads API — lower cost per lead than agencies clicking buttons",
          "Custom apps and integrations: quoting tools, booking systems, whatever your operation needs connected",
          "Quarterly strategy session: what's working, what's next",
          "The answer is never “that’s not in your package”",
        ],
        caption: "from £2,500/mo · 6-month initial term, then rolling monthly · guaranteed lead system",
      }
    ]
  },
  {
    id: "growth-systems",
    label: "SEO & Digital Marketing",
    description: "SEO, paid traffic, lead generation, and funnel systems engineered for measurable growth.",
    icon: "📈",
    tiers: [
      {
        tier: "Starter",
        price: "£1,000/mo",
        originalPrice: "£1,500/mo",
        mostPopular: false,
        deliverables: [
          "SEO strategy to get you on page 1 of Google",
          "Targeted paid ads that generate immediate leads",
          "Automated email sequences that nurture prospects",
          "Monthly growth reports showing clear ROI"
        ],
        caption: "Perfect for businesses that need consistent lead flow without the marketing overwhelm.",
      },
      {
        tier: "Growth",
        price: "£2,500/mo",
        originalPrice: "£3,500/mo",
        mostPopular: true,
        deliverables: [
          "Comprehensive SEO that drives organic traffic daily",
          "Multi-channel ad campaigns across Google, Facebook, LinkedIn",
          "Advanced lead scoring and automated follow-up systems",
          "Conversion rate optimization to maximize every click"
        ],
        caption: "Designed for businesses ready to scale their customer acquisition and dominate their market.",
      },
      {
        tier: "Empire",
        price: "£5,000/mo",
        originalPrice: "£7,000/mo",
        mostPopular: false,
        deliverables: [
          "Full-scale growth system across all marketing channels",
          "Advanced attribution tracking to know exactly what works",
          "Strategic consulting to identify new growth opportunities",
          "Custom dashboards for real-time business intelligence"
        ],
        caption: "Built for market leaders who want predictable, scalable growth systems that work while they sleep.",
      }
    ]
  },
  {
    id: "ai-workforce",
    label: "AI Workforce Solutions",
    description: "Custom AI agents and automation systems that work 24/7 to grow your business.",
    icon: "🤖",
    tiers: [
      {
        tier: "Starter",
        price: "£1,500",
        originalPrice: "£2,500",
        mostPopular: false,
        deliverables: [
          "AI customer service agent that handles inquiries 24/7",
          "Automated lead qualification and scheduling system",
          "Basic workflow automation for repetitive tasks",
          "Integration with your existing CRM and tools"
        ],
        caption: "Perfect for businesses ready to replace manual tasks with AI workforce that never sleeps.",
      },
      {
        tier: "Growth",
        price: "£3,500",
        originalPrice: "£5,000",
        mostPopular: true,
        deliverables: [
          "Multi-agent AI workforce for sales, support, and marketing",
          "Advanced lead generation and nurturing automation",
          "Intelligent workflow automation across all departments",
          "Custom AI training on your business processes and data"
        ],
        caption: "Ideal for businesses ready to deploy a complete AI workforce that drives growth 24/7.",
      },
      {
        tier: "Empire",
        price: "£7,500",
        originalPrice: "£10,000",
        mostPopular: false,
        deliverables: [
          "Enterprise AI workforce with custom-built agents",
          "Complete business automation across all operations",
          "Predictive analytics and AI-driven decision making",
          "Ongoing AI workforce optimization and expansion"
        ],
        caption: "Built for market leaders ready to replace entire departments with intelligent AI workforce.",
      }
    ]
  },
  {
    id: "ai-workforce-as-a-service",
    label: "AI Workforce as a Service",
    description: "Complete AI workforce deployment and management for businesses that want to scale with AI.",
    icon: "🚀",
    tiers: [
      {
        tier: "Starter",
        price: "£2,000/mo",
        originalPrice: "£3,000/mo",
        mostPopular: false,
        deliverables: [
          "Dedicated AI workforce team (2-3 AI agents)",
          "24/7 AI customer service and lead generation",
          "Monthly AI performance optimization",
          "Complete AI workforce management and support"
        ],
        caption: "Perfect for businesses that want a fully managed AI workforce without the technical overhead.",
      },
      {
        tier: "Growth",
        price: "£5,000/mo",
        originalPrice: "£7,500/mo",
        mostPopular: true,
        deliverables: [
          "Advanced AI workforce team (5-7 AI agents)",
          "Multi-department AI automation and integration",
          "Weekly AI strategy and optimization sessions",
          "Custom AI development and continuous improvement"
        ],
        caption: "Ideal for businesses ready to scale operations with a comprehensive AI workforce solution.",
      },
      {
        tier: "Empire",
        price: "£10,000/mo",
        originalPrice: "£15,000/mo",
        mostPopular: false,
        deliverables: [
          "Enterprise AI workforce team (10+ AI agents)",
          "Complete business automation with AI",
          "Dedicated AI strategist and technical support",
          "Custom AI innovation and R&D development"
        ],
        caption: "Built for enterprises ready to revolutionize their entire business with a fully managed AI workforce.",
      }
    ]
  }
];

const PricingSection = () => {
  const [activeCategory, setActiveCategory] = useState(0);
  
  const currentCategory = PACKAGE_CATEGORIES[activeCategory];

  return (
    <section id="pricing" className="text-white py-12 md:py-20 lg:py-24">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-10">
          <span className="inline-block border border-[#f1cb32] text-[#f1cb32] text-xs font-bold px-4 py-1 rounded-full tracking-widest uppercase bg-black/30 shadow-sm mb-6">PACKAGES</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4">
            <span className="text-2xl sm:text-3xl mr-2"></span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f1cb32] to-[#ff8c00]">
              Transparent Pricing. No Retainer Traps.
            </span>
          </h2>
          <p className="text-[#ADB7BE] text-base md:text-lg max-w-2xl mx-auto mb-8">
            Rolling monthly. Cancel anytime. No 12-month lock-ins.
          </p>
        </div>

        {/* Category Description */}
        <motion.div
          key={activeCategory}
          className="text-center mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <p className="text-[#ADB7BE] max-w-2xl mx-auto text-base md:text-lg">{currentCategory.description}</p>
        </motion.div>

        {/* Not ready link — shown for the main pricing tier only */}
        {activeCategory === 0 && (
          <div className="text-center mb-8">
            <a
              href="#contact"
              className="text-[#f1cb32] hover:text-[#ff8c00] transition-colors duration-200 text-sm font-medium underline underline-offset-2"
            >
              Not ready? Get your free AI Visibility Score first →
            </a>
            <p className="text-[#ADB7BE] text-xs mt-1">Two minutes. Costs nothing.</p>
          </div>
        )}

        {/* 3 Tiers Side-by-Side */}
        <motion.div
          key={`category-${activeCategory}`}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto"
          initial={{ opacity: 0.85, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          {currentCategory.tiers.map((tier, i) => (
            <motion.div
              key={tier.tier}
              className={`relative bg-gradient-to-br from-[#181818] via-[#0A0A0A] to-black border-2 rounded-xl p-6 md:p-8 flex flex-col focus:outline-none focus:ring-2 focus:ring-[#f1cb32] transition-all duration-300 overflow-visible hover:scale-[1.02] motion-safe:hover:shadow-[0_0_24px_rgba(241,203,50,0.2)] ${
                tier.mostPopular
                  ? 'border-[#f1cb32] shadow-2xl shadow-[#f1cb32]/25 bg-gradient-to-br from-[#1a1a1a] via-[#0f0f0f] to-black md:scale-105 z-10'
                  : 'border-[#f1cb32]/35'
              }`}
              initial={{ opacity: 0.85, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: "easeOut", delay: i * 0.08 }}
            >
              {tier.mostPopular && (
                <motion.span
                  className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#f1cb32] text-[#222] text-xs font-extrabold px-4 py-1 rounded-full shadow-lg tracking-wide uppercase z-30 border-2 border-[#fff] whitespace-nowrap"
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{ duration: 1.3, repeat: Infinity, repeatType: 'loop', delay: 0.6 }}
                >
                  MOST POPULAR
                </motion.span>
              )}

              <div className="flex items-center gap-2 mb-2">
                <span className={`text-2xl md:text-3xl ${tier.mostPopular ? 'text-[#f1cb32]' : 'text-[#bfa24e]'}`}>
                  {''}
                </span>
                <h3 className="text-xl md:text-2xl font-extrabold tracking-tight text-white drop-shadow-gold">{tier.tier}</h3>
              </div>
              <div className="mb-4 md:mb-6">
                {tier.originalPrice && (
                  <div className="text-sm md:text-base text-white/40 line-through mb-1">{tier.originalPrice}</div>
                )}
                <div className="text-2xl md:text-3xl font-black text-[#f1cb32] tracking-tight drop-shadow-gold">{tier.price}</div>
                {tier.tagline && (
                  <p className="text-[#ADB7BE] text-xs mt-1.5 leading-snug">{tier.tagline}</p>
                )}
              </div>

              <ul className="mb-6 md:mb-8 space-y-3 md:space-y-4 font-light flex-grow">
                {tier.deliverables.map((deliverable, j) => (
                  <li key={j} className="flex items-start text-sm md:text-base text-white/90 gap-2">
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-[#f1cb32]/10 border border-[#f1cb32] flex-shrink-0 mt-0.5">
                      <FaCheckCircle className="text-[#f1cb32] text-xs" />
                    </span>
                    <span>{deliverable}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto">
                <CTAButton
                  href="#contact"
                  className="w-full text-center py-4 text-lg font-bold"
                  eventLabel={`pricing_${currentCategory.id}_${tier.tier.toLowerCase()}_cta`}
                  caption={tier.caption}
                >
                  {tier.cta || "Get Started"}
                </CTAButton>
                {tier.footnote && (
                  <p className="text-[#ADB7BE]/70 text-xs text-center mt-3 leading-snug italic">{tier.footnote}</p>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Summary line below cards */}
        {activeCategory === 0 && (
          <p className="text-center text-[#ADB7BE] text-sm max-w-3xl mx-auto mt-10 leading-relaxed">
            Every package runs on the same AI system. What scales is build capacity: hours, pages, campaigns, apps. Exact price depends on your size and market — fixed quote within 24 hours of your free call.
          </p>
        )}
      </div>
    </section>
  );
};

export default PricingSection;
