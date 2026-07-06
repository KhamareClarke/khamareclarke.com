'use client';

import React, { useState, useRef, useCallback, useEffect } from "react";
import ProjectCard from "./ProjectCard";
import ProjectTag from "./ProjectTag";
import { motion, useInView } from "framer-motion";
import CTAButton from "./CTAButton";
import { Dialog } from '@headlessui/react';

const trackEvent = (category, action, label) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label
    });
  }
};

const caseStudiesData = [
  {
    id: 1,
    company: "MyApproved.com",
    title: "AI Automation for Lead Generation",
    description: "How I built a custom AI agent for MyApproved.com that qualified leads 24/7 and booked sales calls automatically, increasing conversions by 40%.",
    image: "/images/case-studies/myapproved.jpg",
    tag: ["All", "AI"],
    liveUrl: "https://myapproved.com",
    details: "This case study covers the full workflow for MyApproved.com: from initial client pain points, through custom GPT-powered agent build, CRM integration, and measurable business results (40% more leads booked). Includes tech stack, timeline, and business impact.",
    metrics: [
      { icon: "", label: "Leads Booked", value: "+40%" },
      { icon: "", label: "Time Saved", value: "20+ hrs/mo" },
      { icon: "", label: "ROI", value: "3x" }
    ]
  },
  {
    id: 2,
    company: "Omni WTMS",
    title: "Web & App Development for Retail",
    description: "I delivered a scalable e-commerce platform and mobile app for Omni WTMS, boosting online sales and automating inventory.",
    image: "/images/case-studies/owniwtms.jpg",
    tag: ["All", "Web"],
    liveUrl: "https://owniwtms.com",
    details: "End-to-end build of a modern e-commerce platform and mobile app for Omni WTMS with React, Stripe, and a custom admin dashboard. Automated product syncing and order management. Results: 2x online sales, 70% less manual admin work.",
    metrics: [
      { icon: "", label: "Online Sales", value: "2x" },
      { icon: "", label: "Mobile Users", value: "+120%" },
      { icon: "", label: "Manual Admin", value: "-70%" }
    ]
  },
  {
    id: 3,
    company: "IdentI Marketing",
    title: "Digital Marketing Funnel Overhaul",
    description: "I revamped a paid ads and funnel system for IdentI Marketing, doubling their ROAS and reducing CPA.",
    image: "/images/case-studies/identimarketing.jpg",
    tag: ["All", "Marketing"],
    liveUrl: "https://identimarketing.com",
    details: "Audit, redesign, and relaunch of all paid ads, landing pages, and CRM automations for IdentI Marketing. Used analytics to optimize every step. Result: 2x return on ad spend, 30% lower cost per acquisition.",
    metrics: [
      { icon: "", label: "ROAS", value: "2x" },
      { icon: "", label: "Cost per Acquisition", value: "-30%" },
      { icon: "", label: "Conversion Rate", value: "+25%" }
    ]
  },
  {
    id: 4,
    company: "SEO Inforce",
    title: "SEO Strategy & Implementation",
    description: "Developed and executed a comprehensive SEO strategy for SEO Inforce, resulting in 300% organic traffic growth and first-page rankings for competitive keywords.",
    image: "/images/case-studies/seoinforce.jpg",
    tag: ["All", "Marketing"],
    liveUrl: "https://seoinforce.com",
    details: "Complete SEO overhaul including technical SEO, content strategy, and link building for SEO Inforce. Implemented advanced analytics and tracking. Results: 300% traffic increase, first-page rankings for 50+ keywords.",
    metrics: [
      { icon: "", label: "Traffic Growth", value: "+300%" },
      { icon: "", label: "Keywords Ranked", value: "50+" },
      { icon: "", label: "Page 1 Rankings", value: "85%" }
    ]
  },
  {
    id: 5,
    company: "Flip Republic",
    title: "Real Estate Platform Development",
    description: "Built a comprehensive real estate investment platform for Flip Republic with property analytics, deal tracking, and investor management tools.",
    image: "/images/case-studies/fliprepublic.jpg",
    tag: ["All", "Web"],
    liveUrl: "https://fliprepublic.com",
    details: "Custom real estate investment platform with advanced property analytics, deal pipeline management, and investor portal. Integrated with MLS data and financial modeling tools.",
    metrics: [
      { icon: "", label: "Properties Tracked", value: "500+" },
      { icon: "", label: "Active Investors", value: "200+" },
      { icon: "", label: "Deals Closed", value: "+150%" }
    ]
  },
  {
    id: 6,
    company: "Ads Starter",
    title: "Performance Marketing Campaign",
    description: "Launched and optimized multi-channel ad campaigns for Ads Starter, achieving 5x ROI and scaling ad spend profitably.",
    image: "/images/case-studies/adsstarter.jpg",
    tag: ["All", "Marketing"],
    liveUrl: "https://adsstarter.com",
    details: "Multi-channel performance marketing campaign across Google, Facebook, and LinkedIn. Implemented advanced tracking, A/B testing, and conversion optimization strategies.",
    metrics: [
      { icon: "", label: "ROI", value: "5x" },
      { icon: "", label: "Ad Spend Scaled", value: "+400%" },
      { icon: "", label: "Conversion Rate", value: "+65%" }
    ]
  },
  {
    id: 7,
    company: "Upgrade Roofing",
    title: "Local SEO for Roofing Contractor",
    description: "538% growth in Google Business Profile interactions in 90 days, with 30+ qualified calls booked in the first two weeks.",
    image: "/images/case-studies/upgraderoofs.jpg",
    tag: ["All", "SEO"],
    liveUrl: "https://upgraderoofs.co.uk",
    details: "Full local SEO campaign for a UK roofing contractor: Google Business Profile optimisation, on-page SEO, and AI search visibility. Results achieved within the first 90 days.",
    metrics: [
      { icon: "", label: "GBP interactions in 90 days", value: "+538%" },
      { icon: "", label: "Qualified calls in first 2 weeks", value: "30+" }
    ]
  },
  {
    id: 8,
    company: "Leverage Journal",
    title: "Publishing Platform Development",
    description: "Developed a custom content management and publishing platform for Leverage Journal with advanced editorial workflows and subscriber management.",
    image: "/images/case-studies/leveragejournal.jpg",
    tag: ["All", "Web"],
    liveUrl: "https://leveragejournal.com",
    details: "Custom CMS and publishing platform with editorial workflows, subscriber management, and monetization features. Built with Next.js and headless CMS.",
    metrics: [
      { icon: "", label: "Articles Published", value: "1000+" },
      { icon: "", label: "Subscribers", value: "+250%" },
      { icon: "", label: "Revenue", value: "+300%" }
    ]
  },
  {
    id: 9,
    company: "Alkhemmy",
    title: "AI-Powered Business Intelligence",
    description: "Implemented AI-driven analytics and business intelligence tools for Alkhemmy, providing real-time insights and predictive modeling.",
    image: "/images/case-studies/alkhemmy.jpg",
    tag: ["All", "AI"],
    liveUrl: "https://alkhemmy.com",
    details: "AI-powered business intelligence platform with real-time analytics, predictive modeling, and automated reporting. Integrated with existing data sources.",
    metrics: [
      { icon: "", label: "AI Accuracy", value: "94%" },
      { icon: "", label: "Insights Speed", value: "10x faster" },
      { icon: "", label: "Decisions Improved", value: "+85%" }
    ]
  },
  {
    id: 10,
    company: "City Plaza Abu Dhabi",
    title: "Local SEO for Hotel",
    description: "20 qualified enquiries per day sustained over 6 months through local SEO, Google Business Profile management, and AI search optimisation.",
    image: "/images/case-studies/uaeprivateinvestor.jpg",
    tag: ["All", "SEO"],
    liveUrl: "#",
    details: "Local SEO and AI search visibility campaign for City Plaza Abu Dhabi. Sustained 20 qualified enquiries per day over a 6-month period via Google Business Profile, on-page SEO, and Perplexity/ChatGPT optimisation.",
    metrics: [
      { icon: "", label: "Qualified enquiries/day sustained over 6 months", value: "20" }
    ]
  },
  {
    id: 11,
    company: "Leverage Academy",
    title: "E-Learning Platform Development",
    description: "Created a comprehensive e-learning platform for Leverage Academy with course management, student tracking, and certification systems.",
    image: "/images/case-studies/leverageacademy.jpg",
    tag: ["All", "Web"],
    liveUrl: "https://leverageacademy.org",
    details: "Full-featured e-learning platform with course creation tools, student management, progress tracking, and automated certification. Integrated payment processing.",
    metrics: [
      { icon: "", label: "Students Enrolled", value: "5000+" },
      { icon: "", label: "Courses", value: "150+" },
      { icon: "", label: "Completion Rate", value: "78%" }
    ]
  },
  {
    id: 12,
    company: "Inboker",
    title: "AI Chatbot & Automation Suite",
    description: "Developed an intelligent chatbot and automation suite for Inboker, handling customer support, lead qualification, and appointment scheduling.",
    image: "/images/case-studies/inboker.jpg",
    tag: ["All", "AI"],
    liveUrl: "https://inboker.com",
    details: "AI-powered chatbot and automation suite with natural language processing, multi-channel support, and CRM integration. Handles 80% of customer inquiries automatically.",
    metrics: [
      { icon: "", label: "Automation Rate", value: "80%" },
      { icon: "", label: "Response Time", value: "< 1 min" },
      { icon: "", label: "Satisfaction", value: "92%" }
    ]
  },
];

const ProjectsSection = () => {
  const [selectedCase, setSelectedCase] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsToShow, setCardsToShow] = useState(3);
  const [tag, setTag] = useState("SEO");

  const filteredCaseStudies = caseStudiesData.filter((caseStudy) =>
    tag === "All" || caseStudy.tag.includes(tag)
  );

  useEffect(() => {
    const updateCardsToShow = () => {
      if (window.innerWidth >= 1024) {
        setCardsToShow(3);
      } else if (window.innerWidth >= 768) {
        setCardsToShow(2);
      } else {
        setCardsToShow(1);
      }
    };

    updateCardsToShow();
    window.addEventListener('resize', updateCardsToShow);

    return () => {
      window.removeEventListener('resize', updateCardsToShow);
    };
  }, []);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? filteredCaseStudies.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === filteredCaseStudies.length - 1 ? 0 : prev + 1));
  };

  const getVisibleCards = () => {
    const cards = [];
    for (let i = 0; i < cardsToShow; i++) {
      const index = (currentIndex + i) % filteredCaseStudies.length;
      cards.push(filteredCaseStudies[index]);
    }
    return cards;
  };

  const visibleCards = getVisibleCards();

  const closeModal = () => setIsModalOpen(false);

  const handleCardClick = (caseStudy) => {
    setSelectedCase(caseStudy);
    setIsModalOpen(true);
  };

  return (
    <section id="case-studies" className="text-white py-16 lg:py-20 relative">
      {/* Background glow effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/3 left-1/3 h-96 w-96 rounded-full bg-[#ffb700]/5 blur-3xl animate-pulse" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center mb-12 mt-4 w-full text-center">
          <motion.span
            className="bg-transparent border border-[#ffb700] text-[#ffb700] text-xs font-semibold px-4 py-1 rounded-full mb-3 tracking-widest relative flex items-center justify-center overflow-visible"
            initial={{ y: 0 }}
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 2.1, repeat: Infinity, repeatType: "loop" }}
          >
            RESULTS
            {/* Gold sparkle accent */}
            <motion.span
              className="absolute -top-2 -right-3"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.1, 1], opacity: [0, 1, 1] }}
              transition={{ duration: 1.1, delay: 0.7, repeat: Infinity, repeatDelay: 3.2 }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#ffb700"><circle cx="12" cy="12" r="2.2"/><g opacity="0.6"><circle cx="4" cy="12" r="1"/><circle cx="20" cy="12" r="1"/><circle cx="12" cy="4" r="1"/><circle cx="12" cy="20" r="1"/></g></svg>
            </motion.span>
          </motion.span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-center relative mb-4">
            <span className="text-[#ffb700] relative">
              Documented Results.
              <motion.span
                className="absolute left-0 -bottom-1 h-2 w-full rounded-full bg-[#ffb700]"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.1, delay: 0.3 }}
                style={{ transformOrigin: 'left' }}
              />
            </span>
          </h2>
          <p className="text-[#ADB7BE] text-center mt-5 text-sm md:text-base max-w-2xl">Real businesses. Documented results. SEO and AI search, ranked by outcome.</p>
        </div>

        {/* Slider Container */}
        <div className="relative px-4 md:px-12">
          <div className="overflow-hidden">
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              {visibleCards.map((caseStudy, index) => (
                <motion.div
                  key={caseStudy.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                >
                  <ProjectCard
                    title={caseStudy.title}
                    description={caseStudy.description}
                    imgUrl={caseStudy.image}
                    gitUrl={caseStudy.liveUrl}
                    previewUrl={caseStudy.liveUrl}
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={handlePrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-[#1a1a1a] border-2 border-[#ffb700]/30 text-[#ffb700] p-3 rounded-full hover:bg-[#ffb700]/10 hover:border-[#ffb700] transition-all z-10 hidden md:block shadow-lg hover:shadow-[#ffb700]/50"
            aria-label="Previous"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-[#1a1a1a] border-2 border-[#ffb700]/30 text-[#ffb700] p-3 rounded-full hover:bg-[#ffb700]/10 hover:border-[#ffb700] transition-all z-10 hidden md:block shadow-lg hover:shadow-[#ffb700]/50"
            aria-label="Next"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation Buttons */}
        <div className="flex justify-center gap-3 mt-6 md:hidden">
          <button
            onClick={handlePrevious}
            className="bg-[#1a1a1a] border-2 border-[#ffb700]/30 text-[#ffb700] px-6 py-2 rounded-lg hover:bg-[#ffb700]/10 hover:border-[#ffb700] transition-all font-semibold"
          >
            ← Previous
          </button>
          <button
            onClick={handleNext}
            className="bg-[#1a1a1a] border-2 border-[#ffb700]/30 text-[#ffb700] px-6 py-2 rounded-lg hover:bg-[#ffb700]/10 hover:border-[#ffb700] transition-all font-semibold"
          >
            Next →
          </button>
        </div>

        {/* CTA Button */}
        <motion.div
          className="flex justify-center mt-12"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 1.1 }}
          viewport={{ once: true }}
        >
          <CTAButton 
            onClick={() => {
              const contactSection = document.getElementById('contact');
              if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            eventLabel="projects_contact_cta"
            caption={null}
          >
            Book Your Free Strategy Call
          </CTAButton>
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectsSection;
