"use client";
import React from "react";
import CTAButton from "./CTAButton";

const stats = [
  {
    icon: "📈",
    metric: "538%",
    label: "Google Business Profile interactions",
  },
  {
    icon: "🎯",
    metric: "5X",
    label: "Leads in 60 days",
  },
  {
    icon: "📞",
    metric: "~20/day",
    label: "Qualified enquiries at peak",
  },
];

const skills = [
  {
    icon: "🔍",
    title: "SEO Audits and Technical Fixes",
    description: "Full technical audit with a prioritised fix list to ensure search engines crawl and index your site perfectly.",
  },
  {
    icon: "📍",
    title: "Local SEO and Google Business Profile",
    description: "Google Business Profile managed for maximum local reach, driving direct phone calls and physical visits.",
  },
  {
    icon: "🤖",
    title: "AI Search Visibility (ChatGPT, Gemini, Perplexity)",
    description: "Optimised to appear in AI search engines, ensuring your business is recommended when users ask LLMs for solutions.",
  },
  {
    icon: "💬",
    title: "AI Lead Response Systems",
    description: "Every enquiry answered in minutes, around the clock, using intelligent agents trained on your business data.",
  },
  {
    icon: "⚡",
    title: "High-Performance Websites",
    description: "Fast, Core Web Vitals compliant, built to convert traffic into paying customers with zero friction.",
  },
  {
    icon: "📊",
    title: "Plain-English Reporting",
    description: "Monthly updates tracking rankings, calls, and enquiries with absolute transparency and zero jargon.",
  },
];

const ServicesSection = () => {
  return (
    <section id="services" className="py-20 bg-[#111015] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Numbers That Matter Section */}
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
            Numbers That Matter
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Real metrics from real businesses. Results documented below.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="bg-[#1a191f] p-8 rounded-2xl border border-gray-800 hover:border-orange-500/50 transition-all duration-300"
              >
                <span className="text-4xl block mb-4">{stat.icon}</span>
                <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500 block mb-2">
                  {stat.metric}
                </span>
                <p className="text-gray-300 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* AI Implementation Specialist Profile */}
        <div className="bg-[#1a191f] rounded-3xl p-8 md:p-12 border border-gray-800 mb-20">
          <div className="max-w-3xl">
            <span className="text-orange-500 font-bold uppercase tracking-widest text-sm">
              AI Implementation Specialist
            </span>
            <h3 className="text-3xl md:text-4xl font-bold mt-2 mb-6">
              Khamare Clarke
            </h3>
            <p className="text-xl text-gray-300 mb-4 font-semibold">
              SEO backed by AI. Results built in production.
            </p>
            <p className="text-gray-400 text-lg leading-relaxed mb-8">
              I build and rank UK businesses using the same systems I sell. I write the code, run the campaigns, and stay until the numbers move.
            </p>
            <div className="flex items-center space-x-3 text-gray-400 text-sm">
              <span>📍</span>
              <span>Khamare Clarke, AI Implementation Specialist, Stoke-on-Trent</span>
            </div>
          </div>
        </div>

        {/* Skills & Capabilities Grid */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              AI-Powered Business Systems
            </h3>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Every approach tested on live client campaigns before I recommend it. Here is how I help your business dominate.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {skills.map((skill, index) => (
              <div 
                key={index} 
                className="bg-[#1a191f] p-8 rounded-2xl border border-gray-800 hover:border-orange-500/30 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <span className="text-3xl block mb-4">{skill.icon}</span>
                  <h4 className="text-xl font-bold mb-3 text-white">{skill.title}</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">{skill.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-orange-600/10 to-red-600/10 rounded-3xl p-8 md:p-12 border border-orange-500/20">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to get clarity and move fast?
          </h3>
          <p className="text-gray-300 mb-8 max-w-xl mx-auto">
            Book a 30-minute strategy call to discuss how we can implement these AI systems in your business. Zero obligation.
          </p>
          <div className="inline-block">
            <CTAButton 
              className="whitespace-nowrap text-base px-8 py-4 font-bold"
              icon="phone"
              eventLabel="services_book_strategy_call"
            >
              Book a Free Strategy Call
            </CTAButton>
          </div>
          <p className="text-xs text-gray-500 mt-4 flex items-center justify-center gap-1">
            <span>⚡</span> 30 min strategy, zero obligation
          </p>
        </div>

      </div>
    </section>
  );
};

export default ServicesSection;
