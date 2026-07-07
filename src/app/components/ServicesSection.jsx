"use client";
import React from "react";
import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";
import BookingButton from './BookingButton';
import CTAButton from './CTAButton';

// TODO: Each card below requires a visible "chip" badge (e.g. "538% visibility growth"). Adding a chip element requires a new JSX element inside the card — a structural change outside the copy-edit scope. Implement chip in ServicesSection card template, then wire up the chip field from this data.
const services = [
  {
    title: "Get Found",
    description: "The full system for a one-person business: AI receptionist, CRM, SEO, Google Business Profile, and monthly reporting — all done for you.",
    icon: "🔍",
    caption: "from £495/mo. Ranked or refunded.",
  },
  {
    title: "Run The Area",
    description: "Get Found at 2x the monthly hours, plus a new website built to rank and convert, service and area pages, and email campaigns from your existing enquiry list.",
    icon: "📍",
    caption: "from £1,250/mo. 6-month initial term, then rolling monthly.",
  },
  {
    title: "Own The Market",
    description: "Maximum firepower: 4x the hours, Google Ads via the Ads API, custom apps and integrations, and a quarterly strategy session.",
    icon: "⚡",
    caption: "from £2,500/mo. 6-month initial term, then rolling monthly.",
  },
];

const ServicesSection = () => {
  return (
    <section id="services" className="text-white py-16 md:py-20 lg:py-24 relative overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-[#ffb700]/8 blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-[#ff8c00]/6 blur-2xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-gradient-to-r from-[#ffb700]/3 to-[#ff8c00]/3 blur-3xl" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16">
          <motion.span
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#ffb700]/20 to-[#ff8c00]/20 backdrop-blur-sm border border-[#ffb700]/30 text-[#ffb700] text-sm font-bold px-6 py-3 rounded-full mb-8 tracking-wider uppercase"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
            OUR SERVICES
          </motion.span>
          
          <motion.h2
            className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffb700] via-[#ff8c00] to-[#ffb700] animate-pulse">
              AI-Powered
            </span>
            <br />
            <span className="text-white">Business Systems</span>
          </motion.h2>
          
          <motion.p
            className="text-[#ADB7BE] text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Every approach tested on live client campaigns before I recommend it.
          </motion.p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service, idx) => (
            <motion.div
              key={idx}
              className="group relative"
              initial={{ opacity: 0.85, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: "easeOut", delay: idx * 0.08 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
            >
              {/* Card Background with Gradient Border */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#ffb700] via-[#ff8c00] to-[#ffb700] rounded-3xl p-[2px] group-hover:p-[3px] transition-all duration-300">
                <div className="bg-[#0a0a0a] rounded-3xl h-full" />
              </div>
              
              {/* Card Content */}
              <div className="relative bg-gradient-to-br from-[#1a1a1a]/90 to-[#0f0f0f]/90 backdrop-blur-sm rounded-3xl p-8 md:p-10 h-full flex flex-col border border-[#ffb700]/20 group-hover:border-[#ffb700]/40 motion-safe:group-hover:shadow-[0_0_24px_rgba(255,183,0,0.18)] transition-all duration-300">
                {/* Icon */}
                <div className="mb-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#ffb700]/20 to-[#ff8c00]/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <span className="text-4xl">{service.icon}</span>
                  </div>
                </div>
                
                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 group-hover:text-[#ffb700] transition-colors duration-300">
                    {service.title}
                  </h3>
                  <p className="text-[#ADB7BE] text-lg leading-relaxed mb-8">
                    {service.description}
                  </p>
                </div>
                
                {/* CTA Button */}
                <div className="mt-auto">
                  <CTAButton
                    href="/onboarding"
                    className="w-full py-3 px-6 text-base font-semibold"
                    eventLabel={`services_${service.title.toLowerCase().replace(/\s+/g, '_')}_cta`}
                    caption={service.caption}
                  >
                    Get Started
                  </CTAButton>
                </div>
                
                {/* Hover Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#ffb700]/5 to-[#ff8c00]/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="bg-gradient-to-r from-[#1a1a1a]/80 to-[#232323]/80 backdrop-blur-sm border border-[#ffb700]/20 rounded-3xl p-8 md:p-12 max-w-4xl mx-auto">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Not sure which service fits?
            </h3>
            <p className="text-[#ADB7BE] text-lg mb-8 max-w-2xl mx-auto">
              Book a free 30-minute call. I will look at your numbers and tell you exactly which service applies.
            </p>
            
            <BookingButton
              className="group relative inline-flex items-center justify-center px-10 py-5 bg-gradient-to-r from-[#ffb700] to-[#ff8c00] text-black font-black rounded-2xl hover:scale-105 transform transition-all duration-300 text-xl shadow-2xl hover:shadow-[#ffb700]/50 border-2 border-[#ffb700]"
              trackingLabel="services_book_strategy_call"
            >
              <span className="relative z-10 flex items-center gap-3">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                Book a Free Strategy Call
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#ff8c00] to-[#ffb700] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </BookingButton>

            <p className="text-[#ADB7BE] text-sm mt-3">Tell me your situation. I'll tell you which tier fits, or if none do.</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
export default ServicesSection;
