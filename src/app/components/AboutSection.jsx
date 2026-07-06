"use client";
import React, { useTransition, useState } from "react";
import Image from "next/image";
import TabButton from "./TabButton";
import CTAButton from "./CTAButton";
import { motion } from "framer-motion";

const TAB_DATA = [
  {
    title: "Skills",
    id: "skills",
    content: (
      <ul className="flex flex-col gap-4 text-base lg:text-lg">
        <li className="flex items-start gap-2"><span className="text-[#ffb700]">★</span><span><b className="text-[#ffb700]">AI Automation:</b> AI agents & workflows for growth.</span></li>
        <li className="flex items-start gap-2"><span className="text-[#ffb700]">★</span><span><b className="text-[#ffb700]">Web & App:</b> Scalable, high-converting platforms.</span></li>
        <li className="flex items-start gap-2"><span className="text-[#ffb700]">★</span><span><b className="text-[#ffb700]">Digital Marketing:</b> Funnels, ads & SEO that convert.</span></li>
        <li className="flex items-start gap-2"><span className="text-[#ffb700]">★</span><span><b className="text-[#ffb700]">CRM Systems:</b> Bookings & lead scoring that close deals.</span></li>
                <li className="flex items-start gap-2"><span className="text-[#ffb700]">★</span><span><b className="text-[#ffb700]">Analytics:</b> Dashboards & insights for smart decisions.</span></li>
        <li className="flex items-start gap-2"><span className="text-[#ffb700]">★</span><span><b className="text-[#ffb700]">UI/UX Optimization:</b> Interfaces that drive action.</span></li>
        <li className="flex items-start gap-2"><span className="text-[#ffb700]">★</span><span><b className="text-[#ffb700]">Growth Consulting:</b> Systemize & scale your business.</span></li>
      </ul>
    ),
  },
  {
    title: "Education",
    id: "education",
    content: (
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl"></span>
          <span><span className="font-bold text-[#ffb700]">BSc (Hons), Software Engineering</span> – Building technical foundations for scalable platforms.</span>
        </div>
        <div className="flex items-start gap-3">
          <span className="text-2xl"></span>
          <span><span className="font-bold text-[#ffb700]">BSc (Hons), Digital Marketing</span> – Expertise in growth & customer acquisition.</span>
        </div>
        <div className="flex items-start gap-3">
          <span className="text-2xl"></span>
          <span><span className="font-bold text-[#ffb700]">MSc, Computer Science with Artificial Intelligence</span> – Advanced AI applications for real-world business.</span>
        </div>
      </div>
    ),
  },
  {
    title: "Certifications",
    id: "certifications",
    content: (
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl"></span>
          <span><span className="font-bold text-[#ffb700]">Level 4 Diploma</span> – Software Engineering</span>
        </div>
        <div className="flex items-start gap-3">
          <span className="text-2xl"></span>
          <span><span className="font-bold text-[#ffb700]">Level 4 Diploma</span> – Digital Marketing</span>
        </div>
        <div className="flex items-start gap-3">
          <span className="text-2xl"></span>
          <span><span className="font-bold text-[#ffb700]">Level 4 Diploma</span> – Cyber Security</span>
        </div>
        <div className="flex items-start gap-3">
          <span className="text-2xl"></span>
          <span><span className="font-bold text-[#ffb700]">Certified Google Ads & Analytics Specialist</span></span>
        </div>
        <div className="flex items-start gap-3">
          <span className="text-2xl"></span>
          <span><span className="font-bold text-[#ffb700]">AI & Machine Learning Certifications</span> (Project-Based)</span>
        </div>
        <div className="flex items-start gap-3">
          <span className="text-2xl"></span>
          <span><span className="font-bold text-[#ffb700]">Professional Development</span> – SaaS Product Management (Ongoing)</span>
        </div>
      </div>
    ),
  },
];

const AboutSection = () => {
  const [tab, setTab] = useState("skills");
  const [isPending, startTransition] = useTransition();

  const handleTabChange = (id) => {
    startTransition(() => {
      setTab(id);
    });
  };

  return (
    <section className="text-white py-16 md:py-20 relative overflow-hidden" id="about">
      {/* Background Effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/4 right-1/4 h-96 w-96 rounded-full bg-[#ffb700]/6 blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 h-80 w-80 rounded-full bg-[#ff8c00]/4 blur-2xl animate-pulse delay-1000" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.span
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#ffb700]/20 to-[#ff8c00]/20 backdrop-blur-sm border border-[#ffb700]/30 text-[#ffb700] text-sm font-bold px-6 py-3 rounded-full mb-8 tracking-wider uppercase"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
            ABOUT ME
          </motion.span>
          
          <motion.h2 
            className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffb700] to-[#ff8c00]">
              Khamare Clarke
            </span>
            <br />
            <span className="text-white">ranks UK businesses on Google.</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffb700] via-[#ff8c00] to-[#ffb700] animate-pulse">
              He builds leverage.
            </span>
          </motion.h2>
          
          <motion.p 
            className="text-[#ff8c00] text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed font-semibold"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Ten years building and ranking UK businesses. I write the code, run the campaigns, and stay until the numbers move.
          </motion.p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          
          {/* Left: Image */}
          <motion.div
            className="relative order-2 lg:order-1"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#ffb700] via-[#ff8c00] to-[#ffb700] rounded-2xl p-[2px]">
                <div className="bg-[#0a0a0a] rounded-2xl h-full" />
              </div>
              
              <div className="relative bg-gradient-to-br from-[#1a1a1a]/90 to-[#0f0f0f]/90 rounded-2xl p-4">
                <Image 
                  src="/images/about-image.png" 
                  width={400} 
                  height={400} 
                  alt="Khamare Clarke - AI Systems Builder" 
                  className="rounded-xl w-full h-auto object-cover"
                />
              </div>
            </div>
          </motion.div>

          {/* Right: Content */}
          <motion.div
            className="space-y-6 order-1 lg:order-2"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {/* Description */}
            <div className="space-y-4 mb-8">
              <p className="text-base md:text-lg text-[#ADB7BE] leading-relaxed">
                Ten years building and ranking UK businesses. I write the code, run the campaigns, and stay until the numbers move.
              </p>
            </div>

            {/* What he builds - Compact Grid */}
            <div className="bg-gradient-to-br from-[#1a1a1a]/60 to-[#0f0f0f]/60 backdrop-blur-sm border border-[#ffb700]/20 rounded-xl p-6">
              <h3 className="text-xl font-bold text-[#ffb700] mb-4 flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
                What he builds:
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { icon: "", title: "AI Workforce", desc: "AI employees that scale and generate revenue around the clock" },
                  { icon: "", title: "Web and App Development", desc: "Platforms built to convert and scale without friction" },
                  { icon: "", title: "Digital Marketing", desc: "Funnels, paid ads, and SEO that turn traffic into pipeline" },
                  { icon: "", title: "CRM Systems", desc: "Lead scoring and booking flows that close deals automatically" },
                  { icon: "", title: "Analytics", desc: "Dashboards that turn data into decisions that move the business forward" },
                  { icon: "", title: "Growth Consulting", desc: "The strategy and systems to dominate your market" }
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 bg-[#0a0a0a]/30 rounded-lg border border-[#ffb700]/10 hover:border-[#ffb700]/20 transition-all duration-300"
                  >
                    <span className="text-xl flex-shrink-0">{item.icon}</span>
                    <div>
                      <h4 className="text-[#ffb700] font-semibold text-sm mb-1">{item.title}:</h4>
                      <p className="text-[#ADB7BE] text-xs leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Centered CTA */}
        <motion.div
          className="flex justify-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <CTAButton
            href="/#contact"
            className="group relative inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-[#ffb700] to-[#ff8c00] text-black font-black rounded-xl hover:scale-105 transform transition-all duration-300 text-lg shadow-xl hover:shadow-[#ffb700]/50 border-2 border-[#ffb700]"
            icon="bolt"
            eventLabel="about_lets_talk_leverage"
            caption={null}
          >
            <span className="relative z-10 flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
              </svg>
              Let's Talk Leverage
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#ff8c00] to-[#ffb700] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </CTAButton>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
