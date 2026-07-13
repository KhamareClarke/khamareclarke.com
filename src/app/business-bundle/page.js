"use client";

import { FaCheckCircle, FaStar, FaBolt } from "react-icons/fa";
import { useEffect, useState } from "react";
import CTAButton from "../components/CTAButton";
import CookieBanner from "../components/CookieBanner";
import Footer from "../components/Footer";
import BookingButton from "../components/BookingButton";
import BusinessBundleBookingButton from "../components/BusinessBundleBookingButton";
import { Section } from "../components/ui/Section";

// Metadata moved to layout.js since this is a client component

export const metadata = {
  title: "AI Business Growth Specialist | Accelerate Revenue with Smart Automation | Khamare Clarke",
  description:
    "Done-for-you websites, ads, and AI systems that deliver predictable growth for UK businesses. Built to convert. Delivered in 14 days. One transparent price. Zero surprises.",
  alternates: { canonical: "https://khamareclarke.com/business-bundle" },
  openGraph: {
    title: "AI Business Growth Specialist | Accelerate Revenue with Smart Automation | Khamare Clarke",
    description:
      "Done-for-you websites, ads, and AI systems that deliver predictable growth for UK businesses. Built to convert. Delivered in 14 days. One transparent price. Zero surprises.",
    url: "https://khamareclarke.com/business-bundle",
    siteName: "Khamare Clarke",
    locale: "en_GB",
    type: "website",
    images: [
      {
        url: "/images/business-bundle-hero.jpg",
        width: 1200,
        height: 630,
        alt: "AI Business Growth Specialist for UK Businesses",
      },
    ],
  },
};

function SpotsLeftCounter() {
  const [spotsLeft] = useState(2); // Fixed at 2 spots
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Show counter after component mounts
    const visibilityTimer = setTimeout(() => {
      setIsVisible(true);
    }, 1000);

    return () => {
      clearTimeout(visibilityTimer);
    };
  }, []);

  return (
    <div 
      className={`fixed top-3 left-1/2 transform -translate-x-1/2 sm:top-4 sm:right-4 sm:left-auto sm:transform-none bg-gradient-to-r from-red-600 to-red-700 text-white px-3 py-2 sm:px-4 sm:py-3 rounded-full shadow-xl z-50 flex items-center gap-2 transition-all duration-500 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-[-100%] opacity-0'
      } ${isHovered ? 'scale-105' : ''} hover:shadow-red-500/30 cursor-pointer`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => {
        // This will be handled by BookingButton component
      }}
    >
      <div className="relative">
        <div className="absolute -inset-1 bg-red-400 rounded-full blur animate-pulse"></div>
        <div className="relative flex items-center justify-center h-5 w-5 sm:h-6 sm:w-6 bg-white rounded-full">
          <span className="text-red-600 font-bold text-sm">{spotsLeft}</span>
        </div>
      </div>
      <span className="font-bold text-sm sm:text-sm whitespace-nowrap">
        HURRY! {spotsLeft} Spot{spotsLeft === 1 ? '' : 's'} Left
      </span>
      <svg 
        className="w-4 h-4 animate-bounce-horizontal" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
      </svg>
    </div>
  );
}

function BusinessBundleClientContent() {
  const [openFAQ, setOpenFAQ] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState(null);

  // Track page view and capture UTM parameters
  useEffect(() => {
    // Capture UTM parameters
    const urlParams = new URLSearchParams(window.location.search);
    const utmParams = {
      utm_source: urlParams.get('utm_source') || 'direct',
      utm_medium: urlParams.get('utm_medium') || 'none',
      utm_campaign: urlParams.get('utm_campaign') || '',
      utm_content: urlParams.get('utm_content') || '',
      utm_term: urlParams.get('utm_term') || ''
    };
    
    // Store UTM params in sessionStorage for later use
    if (utmParams.utm_source !== 'direct') {
      sessionStorage.setItem('utm_params', JSON.stringify(utmParams));
    }
    
    // Track page view with UTM data
    if (typeof window !== 'undefined' && typeof gtag !== 'undefined') {
      gtag('event', 'view_business_bundle', {
        event_category: 'page_view',
        event_label: 'business_bundle_landing',
        ...utmParams
      });
    }
    
    // Push to dataLayer for GTM
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: 'view_business_bundle',
        page_path: '/business-bundle',
        ...utmParams
      });
    }
    
    // Custom booking widget event listeners
    const handleBookingEvent = (e) => {
      // Listen for custom booking widget events
      if (e.data.event && e.data.event.indexOf('booking') === 0) {
        const eventName = e.data.event;
        
        if (eventName === 'booking.widget_opened') {
          // User opened booking widget
          if (typeof gtag !== 'undefined') {
            gtag('event', 'booking_start', {
              event_category: 'engagement',
              event_label: 'booking_widget_opened'
            });
          }
          if (window.dataLayer) {
            window.dataLayer.push({
              event: 'booking_start',
              booking_action: 'widget_opened'
            });
          }
        } else if (eventName === 'booking.meeting_scheduled') {
          // User booked a meeting
          if (typeof gtag !== 'undefined') {
            gtag('event', 'booking_completed', {
              event_category: 'conversion',
              event_label: 'meeting_scheduled',
              value: 1
            });
          }
          if (window.dataLayer) {
            window.dataLayer.push({
              event: 'booking_completed',
              booking_action: 'meeting_scheduled',
              conversion_value: 1
            });
          }
        }
      }
      
      // Keep legacy Calendly support for any remaining instances
      if (e.data.event && e.data.event.indexOf('calendly') === 0) {
        const eventName = e.data.event;
        
        if (eventName === 'calendly.event_type_viewed') {
          if (typeof gtag !== 'undefined') {
            gtag('event', 'calendly_start', {
              event_category: 'engagement',
              event_label: 'calendly_widget_opened'
            });
          }
        } else if (eventName === 'calendly.event_scheduled') {
          if (typeof gtag !== 'undefined') {
            gtag('event', 'calendly_booked', {
              event_category: 'conversion',
              event_label: 'meeting_scheduled',
              value: 1
            });
          }
        }
      }
    };
    
    window.addEventListener('message', handleBookingEvent);
    
    return () => {
      window.removeEventListener('message', handleBookingEvent);
    };
  }, []);

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    
    const data = {
      name: e.target.name.value,
      email: e.target.email.value,
      phone: e.target.phone.value,
      businessType: e.target.businessType.value,
      message: e.target.message.value,
    };
    const JSONdata = JSON.stringify(data);
    const endpoint = "/api/send";

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSONdata,
    };

    try {
      console.log("Sending request to:", endpoint);
      console.log("Request data:", data);
      
      const response = await fetch(endpoint, options);
      console.log("Response status:", response.status);
      
      const resData = await response.json();
      console.log("Response data:", resData);

      if (response.status === 200) {
        console.log("Business Bundle form submitted successfully.");
        setFormSubmitted(true);
        
        // Track form submission
        if (typeof gtag !== 'undefined') {
          gtag('event', 'form_submit', {
            event_category: 'engagement',
            event_label: 'business_bundle_form'
          });
        }
      } else {
        console.error("Form submission failed:", resData);
        setFormError(resData.error || "Form submission failed. Please try again.");
      }
    } catch (error) {
      console.error("Network error:", error);
      setFormError(`Network error: ${error.message}. Please check your connection and try again.`);
    }
  };


  return (
    <main className="flex min-h-screen flex-col bg-[#121212]">
      <SpotsLeftCounter />
      {/* Full-Screen Hero with Frame */}
      <Section as="section" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0a0a] via-[#121212] to-[#1a1a1a] relative overflow-hidden p-2 xs:p-3 sm:p-4 md:p-6 lg:p-8">
        {/* Background Effects */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 left-1/4 h-32 w-32 xs:h-48 xs:w-48 sm:h-64 sm:w-64 md:h-96 md:w-96 rounded-full bg-[#ffb700]/5 blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 h-32 w-32 xs:h-48 xs:w-48 sm:h-64 sm:w-64 md:h-96 md:w-96 rounded-full bg-white/3 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-64 w-64 xs:h-96 xs:w-96 sm:h-[400px] sm:w-[400px] md:h-[500px] md:w-[500px] lg:h-[600px] lg:w-[600px] rounded-full bg-[#ffb700]/3 blur-[60px] sm:blur-[80px] lg:blur-[100px]" />
        </div>
        
        {/* Main Content Frame */}
        <div className="relative z-10 w-full max-w-xs xs:max-w-sm sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl mx-auto">
          <div className="bg-[#1a1a1a]/90 backdrop-blur-xl border border-[#ffb700]/20 xs:border-2 xs:border-[#ffb700]/30 rounded-xl xs:rounded-2xl sm:rounded-3xl p-3 xs:p-4 sm:p-6 md:p-8 lg:p-12 xl:p-16 shadow-xl xs:shadow-2xl">
            
            {/* Badge */}
            <div className="flex justify-center mb-3 xs:mb-4 sm:mb-6 md:mb-8">
              <span className="inline-flex items-center rounded-full bg-gradient-to-r from-[#ffb700]/30 to-[#ff8c00]/30 border border-[#ffb700]/50 text-[#ffb700] px-2 py-1 xs:px-3 xs:py-1.5 sm:px-4 sm:py-2 md:px-6 md:py-3 text-xs xs:text-sm sm:text-base font-bold uppercase tracking-wider shadow-lg backdrop-blur-sm animate-bounce">
                🚀 Best for Startups
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-center text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-[#ffb700] leading-tight tracking-tight mb-2 xs:mb-3 sm:mb-4">
              AI Business Growth Specialist
            </h1>
            
            <h2 className="text-center text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl bg-gradient-to-r from-[#ffb700] to-[#ff8c00] bg-clip-text text-transparent font-bold mb-4 xs:mb-5 sm:mb-6 md:mb-8">
              Accelerate Revenue with Smart Automation
            </h2>

            {/* Price Section */}
            <div className="text-center mb-4">
              <div className="inline-flex items-center gap-2 bg-[#0f0f0f] border border-[#ffb700]/30 rounded-lg px-5 py-3">
                <span className="text-white/60 text-base line-through">£5,000</span>
                <span className="text-3xl sm:text-4xl font-black text-[#ffb700]">£699</span>
                <span className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">SAVE 86%</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-center text-white/90 max-w-full xs:max-w-lg sm:max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed mb-4 xs:mb-5 sm:mb-6 md:mb-8 lg:mb-10 px-2 xs:px-0">
              <span className="text-[#ffb700] font-medium">Done-for-you websites, ads, and AI systems that deliver predictable growth for UK businesses.</span>
            </p>
            
            <p className="text-center text-white font-medium text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl mb-6 xs:mb-7 sm:mb-8 md:mb-10 lg:mb-12 px-2 xs:px-0">
              Built to convert. Delivered in 14 days. One transparent price. Zero surprises.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6 xs:mb-7 sm:mb-8 md:mb-10 lg:mb-12">
              <BusinessBundleBookingButton
                className="group relative inline-flex items-center justify-center whitespace-nowrap px-4 py-2.5 xs:px-6 xs:py-3 sm:px-8 sm:py-4 md:px-10 md:py-5 lg:px-12 lg:py-6 text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl font-black text-black bg-gradient-to-r from-[#fdbd18] to-[#ff8c00] rounded-2xl shadow-xl xs:shadow-2xl hover:shadow-[#fdbd18]/50 transform hover:scale-105 transition-all duration-300 border xs:border-2 lg:border-3 border-[#fdbd18] w-full sm:w-auto min-w-[250px] md:min-w-[300px]"
                trackingLabel="hero_cta"
              >
                <span className="relative z-10">📞 Book Your Free Growth Call</span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#ff8c00] to-[#fdbd18] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </BusinessBundleBookingButton>
              
              <button
                onClick={() => {
                  document.getElementById('explainer-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="group relative inline-flex items-center justify-center whitespace-nowrap px-4 py-2.5 xs:px-6 xs:py-3 sm:px-8 sm:py-4 text-sm xs:text-base sm:text-lg font-bold text-white bg-transparent border-2 border-white/30 hover:border-[#fdbd18] rounded-2xl hover:bg-[#fdbd18]/10 transition-all duration-300 w-full sm:w-auto"
              >
                <span className="relative z-10">👀 See How It Works</span>
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center justify-center gap-1 mb-2 flex-wrap">
              <div className="flex items-center gap-1 bg-green-500/20 border border-green-500/30 rounded-full px-1 py-0.5">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                <span className="text-green-300 text-xs">14-Day Delivery</span>
              </div>
              <div className="flex items-center gap-1 bg-blue-500/20 border border-blue-500/30 rounded-full px-1 py-0.5">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
                <span className="text-blue-300 text-xs">Secure Payment</span>
              </div>
              <div className="flex items-center gap-1 bg-purple-500/20 border border-purple-500/30 rounded-full px-1 py-0.5">
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse" />
                <span className="text-purple-300 text-xs">Free Revisions</span>
              </div>
            </div>

            {/* Social Proof */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 xs:gap-2 text-[#ffb700] mb-3 xs:mb-4 sm:mb-6 flex-wrap">
                {Array.from({ length: 5 }).map((_, i) => (
                  <FaStar key={i} className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl" />
                ))}
                <span className="ml-1 xs:ml-2 sm:ml-4 text-white font-medium text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl">"Transparent and efficient - got results in 2 weeks"</span>
              </div>
              
              <div className="bg-[#0f0f0f]/90 backdrop-blur-sm border border-white/20 rounded-lg xs:rounded-xl sm:rounded-2xl px-3 py-2 xs:px-4 xs:py-3 sm:px-6 sm:py-4 md:px-8 md:py-6 max-w-full xs:max-w-lg sm:max-w-2xl md:max-w-3xl mx-auto">
                <p className="text-white/90 text-xs xs:text-sm sm:text-base md:text-lg mb-1 xs:mb-2 sm:mb-3">
                  ✅ <span className="font-semibold text-[#ffb700]">14‑day revision window</span> - Perfect your site until it's exactly right
                </p>
                <p className="text-white/90 text-xs xs:text-sm sm:text-base md:text-lg">
                  🎯 <span className="font-semibold text-[#ffb700]">45‑minute handover call</span> - Learn everything you need to succeed
                </p>
              </div>
            </div>
            
            {/* Review Section */}
            <div className="text-center mt-6">
              <p className="text-[#ffb700] text-sm sm:text-base font-semibold mb-1">
                ★★★★★ 5.0/5.0 from real UK business owners
              </p>
              <p className="text-white text-xs sm:text-sm mb-4">
                "Delivered our site in 7 days! Doubled our leads with AI." – Myapproved.com
              </p>

              {/* Logos Section */}
              <div className="flex justify-center gap-4 mt-4">
                <img src="/images/testimonials/identi-logo.png" alt="Identi Logo" className="h-8 sm:h-10" />
                <img src="/images/testimonials/myapproved-logo.png" alt="MyApproved Logo" className="h-8 sm:h-10" />
                <img src="/images/testimonials/omni-logo.png" alt="Omni Logo" className="h-8 sm:h-10" />
              </div>
            </div>

          </div>
        </div>
      </Section>

      {/* START: Offer Framing Block */}
      <section className="bg-black text-white py-16 md:py-20 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-[#fdbd18]/5 blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            
            {/* Bundle Includes */}
            <div className="text-center bg-[#1a1a1a]/90 backdrop-blur-sm border-2 border-[#fdbd18]/20 hover:border-[#fdbd18]/40 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-[#fdbd18] to-[#ff8c00] rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">📦</span>
              </div>
              <h3 className="text-xl font-bold text-[#fdbd18] mb-4">Bundle Includes</h3>
              <ul className="text-white/90 space-y-2 text-sm">
                <li>✓ AI-Powered Website</li>
                <li>✓ Google Ads Setup</li>
                <li>✓ AI CRM System</li>
                <li>✓ Lead Generation</li>
                <li>✓ Analytics Dashboard</li>
              </ul>
            </div>

            {/* Guarantee */}
            <div className="text-center bg-[#1a1a1a]/90 backdrop-blur-sm border-2 border-[#fdbd18]/20 hover:border-[#fdbd18]/40 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-[#fdbd18] to-[#ff8c00] rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">🛡️</span>
              </div>
              <h3 className="text-xl font-bold text-[#fdbd18] mb-4">Guarantee</h3>
              <p className="text-white/90 text-sm leading-relaxed">
                <strong className="text-white">Leads in 30 Days</strong><br/>
                or We Work Free Until You Do
              </p>
            </div>

            {/* Proof */}
            <div className="text-center bg-[#1a1a1a]/90 backdrop-blur-sm border-2 border-[#fdbd18]/20 hover:border-[#fdbd18]/40 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-[#fdbd18] to-[#ff8c00] rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">🏆</span>
              </div>
              <h3 className="text-xl font-bold text-[#fdbd18] mb-4">Proof</h3>
              <p className="text-white/90 text-sm mb-4">Trusted by UK startups & SMEs</p>
              <div className="flex justify-center items-center gap-3 opacity-80">
                <img src="/images/testimonials/omni-logo.png" alt="Omni WTMS" className="h-10 w-auto object-contain mix-blend-lighten brightness-110" />
                <img src="/images/testimonials/identi-logo.png" alt="IdentI Marketing" className="h-10 w-auto object-contain mix-blend-lighten brightness-110" />
                <img src="/images/testimonials/myapproved-logo.png" alt="MyApproved.com" className="h-10 w-auto object-contain mix-blend-lighten brightness-110" />
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* END: Offer Framing Block */}

      {/* What's Included Section */}
      <section id="explainer-section" className="bg-gradient-to-br from-[#0a0a0a] via-[#121212] to-[#1a1a1a] relative overflow-hidden py-20">
        {/* Background Effects */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 right-1/4 h-64 w-64 rounded-full bg-[#ffb700]/5 blur-3xl animate-pulse" />
          <div className="absolute bottom-0 left-1/4 h-64 w-64 rounded-full bg-white/3 blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          {/* Main Content Frame */}
          <div className="p-8 sm:p-12">
            
            {/* Badge */}
            <div className="flex justify-center mb-6">
              <span className="inline-flex items-center rounded-full bg-gradient-to-r from-[#ffb700]/30 to-[#ff8c00]/30 border border-[#ffb700]/50 text-[#ffb700] px-4 py-2 text-sm font-bold uppercase tracking-wider shadow-lg backdrop-blur-sm">
                ✨ Complete Package
              </span>
            </div>

            {/* Headline */}
            <h2 className="text-center text-3xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-[#ffb700] leading-tight mb-4">
              What's Included
            </h2>
            
            <p className="text-center text-white/80 text-lg sm:text-xl mb-12 max-w-3xl mx-auto leading-relaxed">
              <span className="text-[#ffb700] font-semibold">Everything you need to dominate your market</span> - delivered in one complete, conversion-optimized package.
            </p>
            
            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
              {[
                { icon: "🌐", text: "Bespoke Website (mobile, SEO, fast, branded)" },
                { icon: "🤖", text: "AI Chatbot (lead capture or bookings)" },
                { icon: "📞", text: "AI Voice Receptionist (or WhatsApp agent)" },
                { icon: "📍", text: "Google Business Profile & Local SEO" },
                { icon: "📱", text: "Social Media Launch (setup + 8 posts)" },
                { icon: "🏠", text: "1 Year Hosting" },
                { icon: "⚡", text: "7-Day Delivery Guarantee" },
                { icon: "🛠️", text: "30 Days After-Launch Support" }
              ].map((item, i) => (
                <div key={i} className="group bg-[#0f0f0f]/80 backdrop-blur-sm border border-[#ffb700]/20 rounded-xl p-4 hover:border-[#ffb700]/50 hover:bg-[#ffb700]/5 transition-all duration-300 hover:scale-105">
                  <div className="flex flex-col items-center text-center gap-3">
                    <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-300">
                      {item.icon}
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <FaCheckCircle className="text-[#ffb700] flex-shrink-0" />
                      <div className="w-full h-px bg-gradient-to-r from-[#ffb700]/30 to-transparent"></div>
                    </div>
                    <p className="text-white/90 text-sm font-medium leading-tight">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Value Proposition */}
            <div className="bg-[#0f0f0f]/90 backdrop-blur-sm border border-[#ffb700]/30 rounded-2xl p-6 mb-8">
              <div className="text-center">
                <p className="text-[#ffb700] font-bold text-lg mb-2">
                  🎯 Built to Convert. Delivered Fast. Zero Surprises.
                </p>
                <p className="text-white/80 text-base">
                  Everything you need to launch and grow - in one package.
                </p>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center">
              <BusinessBundleBookingButton
                className="group relative inline-flex items-center justify-center px-10 py-5 bg-gradient-to-r from-[#ffb700] to-[#ff8c00] text-black font-black rounded-2xl hover:scale-105 transform transition-all duration-300 text-lg shadow-xl hover:shadow-[#ffb700]/50 border-2 border-[#ffb700]"
                trackingLabel="secure_spot_cta"
              >
                <span className="relative z-10">🚀 Secure Your Spot Now</span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#ff8c00] to-[#ffb700] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </BusinessBundleBookingButton>
              <p className="text-white/60 text-sm mt-4">
                Limited slots available • No setup fees • 7-day delivery guarantee
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-gradient-to-br from-[#0a0a0a] via-[#121212] to-[#1a1a1a] relative overflow-hidden py-20">
        {/* Background Effects */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 left-1/4 h-64 w-64 rounded-full bg-[#ffb700]/5 blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 h-64 w-64 rounded-full bg-white/3 blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <div className="p-8 sm:p-12">
            {/* Badge */}
            <div className="flex justify-center mb-6">
              <span className="inline-flex items-center rounded-full bg-gradient-to-r from-[#ffb700]/30 to-[#ff8c00]/30 border border-[#ffb700]/50 text-[#ffb700] px-4 py-2 text-sm font-bold uppercase tracking-wider shadow-lg backdrop-blur-sm">
                ✨ Client Success Stories
              </span>
            </div>

            {/* Headline */}
            <h2 className="text-center text-3xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-[#ffb700] leading-tight mb-4">
              Real Results from Real Clients
            </h2>
            
            <p className="text-center text-white/80 text-lg sm:text-xl mb-12 max-w-3xl mx-auto leading-relaxed">
              <span className="text-[#ffb700] font-semibold">See how businesses like yours transformed their online presence</span> and achieved remarkable results.
            </p>
            
            {/* Testimonials Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
              {[
                {
                  quote: "Professional, fast, and results-driven. Our website now converts visitors into paying customers.",
                  author: "James Morgan",
                  company: "Operations Lead, Omni WTMS",
                  avatar: "/images/testimonials/identi.png"
                },
                {
                  quote: "Delivered our site in 7 days! Doubled our leads with AI.",
                  author: "Olivia Chen",
                  company: "CEO, IdentI Marketing",
                  avatar: "/images/testimonials/omni.png"
                },
                {
                  quote: "Professional, fast, and the chatbot is a game-changer.",
                  author: "Simon Ellis",
                  company: "Head of Growth, MyApproved.com",
                  avatar: "/images/testimonials/myapproved.png"
                }
              ].map((testimonial, i) => (
                <div key={i} className="group bg-[#0f0f0f]/80 backdrop-blur-sm border border-[#ffb700]/20 rounded-xl p-4 sm:p-6 hover:border-[#ffb700]/50 hover:bg-[#ffb700]/5 transition-all duration-300 hover:scale-105">
                  <div className="flex justify-center mb-4">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.author}
                      className="w-16 h-16 rounded-full border-2 border-[#ffb700]/50 object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="w-16 h-16 rounded-full bg-[#ffb700]/20 border-2 border-[#ffb700]/50 items-center justify-center text-[#ffb700] font-bold text-2xl" style={{display: 'none'}}>
                      {testimonial.author.charAt(0)}
                    </div>
                  </div>
                  <p className="text-white/90 text-lg mb-6 italic text-center">"{testimonial.quote}"</p>
                  <div className="text-center">
                    <p className="text-[#ffb700] font-bold text-sm">- {testimonial.author}</p>
                    <p className="text-white/60 text-xs">{testimonial.company}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="text-center">
              <p className="text-white/80 text-lg mb-6">
                Join hundreds of successful businesses who chose to work with us.
              </p>
              <BusinessBundleBookingButton
                className="group relative inline-flex items-center justify-center px-10 py-5 bg-gradient-to-r from-[#ffb700] to-[#ff8c00] text-black font-black rounded-2xl hover:scale-105 transform transition-all duration-300 text-lg shadow-xl hover:shadow-[#ffb700]/50 border-2 border-[#ffb700]"
                trackingLabel="success_story_cta"
              >
                <span className="relative z-10">💼 Start Your Success Story</span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#ff8c00] to-[#ffb700] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </BusinessBundleBookingButton>
              <p className="text-white/60 text-sm mt-4">
                Limited spots available • No setup fees • 7-day delivery guarantee
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gradient-to-b from-[#0a0a0a] to-[#121212] relative overflow-hidden py-20">
        {/* Background Effects */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-1/3 left-1/4 h-96 w-96 rounded-full bg-[#ffb700]/5 blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/3 h-64 w-64 rounded-full bg-white/3 blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <div className="p-8 sm:p-12">
            {/* Badge */}
            <div className="flex justify-center mb-6">
              <span className="inline-flex items-center rounded-full bg-gradient-to-r from-[#ffb700]/30 to-[#ff8c00]/30 border border-[#ffb700]/50 text-[#ffb700] px-4 py-2 text-sm font-bold uppercase tracking-wider shadow-lg backdrop-blur-sm">
                ⚡ Simple 3-Step Process
              </span>
            </div>

            {/* Headline */}
            <h2 className="text-center text-3xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-[#ffb700] leading-tight mb-4">
              How It Works
            </h2>
            
            <p className="text-center text-white/80 text-lg sm:text-xl mb-12 max-w-3xl mx-auto leading-relaxed">
              <span className="text-[#ffb700] font-semibold">From zero to launch in just 14 days</span> with our streamlined process
            </p>
            
            {/* Steps Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {[
                { 
                  step: "1", 
                  title: "Book your spot", 
                  desc: "Lock in a kickoff date. I'll share a quick prep checklist.", 
                  foot: "Kickoff meeting + planning",
                  icon: "📅"
                },
                { 
                  step: "2", 
                  title: "We build in 14 days", 
                  desc: "Design, content, set-up, and integrations - handled.", 
                  foot: "Reviews + content staging",
                  icon: "⚡"
                },
                { 
                  step: "3", 
                  title: "Go live + iterate", 
                  desc: "Launch, measure, and tweak based on real data.", 
                  foot: "Post‑launch tweaks + tracking",
                  icon: "🚀"
                },
              ].map((item, i) => (
                <div key={i} className="group bg-[#0f0f0f]/80 backdrop-blur-sm border border-[#ffb700]/20 rounded-2xl p-8 hover:border-[#ffb700]/50 hover:bg-[#ffb700]/5 transition-all duration-300 hover:scale-[1.02]">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-[#ffb700] to-[#ff8c00] text-black text-xl font-bold">
                      {item.icon}
                    </div>
                    <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#ffb700] to-[#ff8c00]">
                      STEP {item.step}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-white/80 mb-5 leading-relaxed">{item.desc}</p>
                  <div className="flex items-center gap-2 text-sm text-[#ffb700] font-medium">
                    <div className="w-2 h-2 bg-[#ffb700] rounded-full"></div>
                    {item.foot}
                  </div>
                </div>
              ))}
            </div>
            
            {/* CTA */}
            <div className="text-center">
              <p className="text-white/80 text-lg mb-6">
                Limited slots (2) for faster delivery. <span className="text-[#ffb700] font-semibold">Book now</span> to secure your spot.
              </p>
              <BusinessBundleBookingButton
                className="group relative inline-flex items-center justify-center px-10 py-5 bg-gradient-to-r from-[#ffb700] to-[#ff8c00] text-black font-black rounded-2xl hover:scale-105 transform transition-all duration-300 text-lg shadow-xl hover:shadow-[#ffb700]/50 border-2 border-[#ffb700]"
                trackingLabel="kickoff_booking_cta"
              >
                <span className="relative z-10">🚀 Book Your Kickoff</span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#ff8c00] to-[#ffb700] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </BusinessBundleBookingButton>
              <p className="text-white/60 text-sm mt-4">
                No commitment • 7-day delivery guarantee • 30-day support included
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Limited Time Banner */}
      <section className="bg-gradient-to-br from-[#0a0a0a] to-[#121212] relative overflow-hidden py-12 border-t border-white/5">
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <div className="flex flex-col items-center text-center">
            {/* FOMO Timer */}
            <div className="bg-red-600/20 border border-red-500/50 rounded-lg px-4 py-2 mb-6">
              <div className="flex items-center justify-center gap-3 text-red-400">
                <div className="animate-pulse">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-sm font-bold">ONLY 2 SPOTS LEFT THIS MONTH</span>
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-red-500/50 rounded-full"></div>
                  <div className="w-2 h-2 bg-red-500/20 rounded-full"></div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-2 h-2 bg-[#ffb700] rounded-full"></div>
              <span className="text-[#ffb700] text-sm font-bold uppercase tracking-wider">Limited Time Offer</span>
              <div className="w-2 h-2 bg-[#ffb700] rounded-full"></div>
            </div>
            
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Only <span className="text-[#ffb700]">£699</span> for the first 5 clients
            </h3>
            
            <p className="text-white/70 mb-6 max-w-2xl">
              After this, rates rise. Only 2 spots left this month.
            </p>
            
            <BusinessBundleBookingButton
              className="group relative inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-[#ffb700] to-[#ff8c00] text-black font-bold rounded-xl hover:scale-105 transform transition-all duration-300 text-base shadow-lg hover:shadow-[#ffb700]/30 border border-[#ffb700]"
              trackingLabel="limited_time_cta"
            >
              <span className="relative z-10">🚀 Secure Your Spot Now</span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#ff8c00] to-[#ffb700] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </BusinessBundleBookingButton>
          </div>
        </div>
      </section>

      {/* Why Not Competitors */}
      <section className="bg-gradient-to-br from-[#0a0a0a] to-[#121212] relative overflow-hidden py-16 border-t border-white/5">
        <div className="container mx-auto px-4 max-w-4xl relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Why Not <span className="text-red-400">Fiverr, Wix, or Upwork?</span>
            </h2>
            <p className="text-white/70">Here's what you get with us vs. the alternatives</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#0f0f0f]/50 border border-red-500/20 rounded-xl p-6 text-center">
              <div className="text-3xl mb-3">🎭</div>
              <h3 className="text-red-400 font-bold mb-2">Fiverr</h3>
              <ul className="text-white/60 text-sm space-y-1">
                <li>❌ Hit-or-miss quality</li>
                <li>❌ No ongoing support</li>
                <li>❌ Communication barriers</li>
                <li>❌ Generic templates</li>
              </ul>
            </div>
            
            <div className="bg-[#0f0f0f]/50 border border-red-500/20 rounded-xl p-6 text-center">
              <div className="text-3xl mb-3">🏗️</div>
              <h3 className="text-red-400 font-bold mb-2">Wix/Squarespace</h3>
              <ul className="text-white/60 text-sm space-y-1">
                <li>❌ Limited customization</li>
                <li>❌ No AI integration</li>
                <li>❌ DIY = time-consuming</li>
                <li>❌ Basic lead capture</li>
              </ul>
            </div>
            
            <div className="bg-[#0f0f0f]/50 border border-[#ffb700]/30 rounded-xl p-6 text-center">
              <div className="text-3xl mb-3">🚀</div>
              <h3 className="text-[#ffb700] font-bold mb-2">Our Business Bundle</h3>
              <ul className="text-white/80 text-sm space-y-1">
                <li>✅ Custom AI-powered system</li>
                <li>✅ 7-day delivery guarantee</li>
                <li>✅ Direct UK-based support</li>
                <li>✅ Built for conversions</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Growth Plan */}
      <section className="bg-gradient-to-br from-[#0a0a0a] to-[#121212] relative overflow-hidden py-20 border-t border-white/5">
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <div className="p-8 sm:p-12 bg-[#0f0f0f]/50 backdrop-blur-sm border border-white/5 rounded-2xl">
            {/* Badge */}
            <div className="flex justify-center mb-6">
              <span className="inline-flex items-center rounded-full bg-gradient-to-r from-[#ffb700]/30 to-[#ff8c00]/30 border border-[#ffb700]/50 text-[#ffb700] px-4 py-2 text-sm font-bold uppercase tracking-wider shadow-lg backdrop-blur-sm">
                🚀 Growth Plan
              </span>
            </div>

            {/* Headline */}
            <h2 className="text-center text-3xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-[#ffb700] leading-tight mb-4">
              Want Ongoing Growth & Support?
            </h2>
            
            <p className="text-center text-white/80 text-lg sm:text-xl mb-12 max-w-3xl mx-auto leading-relaxed">
              After your launch, upgrade to the Growth Plan:
            </p>
            
            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {[
                { text: "Ongoing hosting & security", icon: "🛡️" },
                { text: "Social media posts & accounts", icon: "📱" },
                { text: "AI chatbot & voice updates", icon: "🤖" },
                { text: "SEO reports & ranking boosts", icon: "📊" },
                { text: "Priority support", icon: "⚡" },
                { text: "Monthly performance reports", icon: "📈" }
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-4 bg-[#0a0a0a]/50 rounded-lg border border-white/5 hover:border-[#ffb700]/30 transition-colors">
                  <span className="text-xl mt-0.5">{item.icon}</span>
                  <p className="text-white/90">{item.text}</p>
                </div>
              ))}
            </div>
            
            {/* Pricing */}
            <div className="text-center mb-8">
              <p className="text-2xl sm:text-3xl font-bold text-white mb-2">
                <span className="text-[#ffb700]">£199</span>/month
              </p>
              <p className="text-white/60 text-sm">Optional but highly recommended</p>
            </div>
            
            {/* CTA */}
            <div className="text-center">
              <p className="text-white/70 mb-6 max-w-2xl mx-auto">
                Stay ahead of the competition, never worry about updates or growth again.
              </p>
              <BusinessBundleBookingButton
                className="group relative inline-flex items-center justify-center px-10 py-5 bg-gradient-to-r from-[#ffb700] to-[#ff8c00] text-black font-black rounded-2xl hover:scale-105 transform transition-all duration-300 text-lg shadow-xl hover:shadow-[#ffb700]/50 border-2 border-[#ffb700]"
                trackingLabel="growth_plan_cta"
              >
                <span className="relative z-10">🚀 Learn More About Growth Plan</span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#ff8c00] to-[#ffb700] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </BusinessBundleBookingButton>
              <p className="text-white/60 text-sm mt-4">
                No long-term contracts • Cancel anytime • 14-day money-back guarantee
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-gradient-to-br from-[#0a0a0a] to-[#121212] relative overflow-hidden py-20 border-t border-white/5">
        <div className="container mx-auto px-4 max-w-4xl relative z-10">
          {/* Section Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-2 h-2 bg-[#ffb700] rounded-full"></div>
              <span className="text-[#ffb700] text-sm font-bold uppercase tracking-wider">Section 6</span>
              <div className="w-2 h-2 bg-[#ffb700] rounded-full"></div>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4">
              Frequently Asked <span className="text-[#ffb700]">Questions</span>
            </h2>
            <p className="text-white/70 max-w-2xl mx-auto">
              Everything you need to know about your Business Bundle
            </p>
          </div>
          
          {/* Accordion */}
          <div className="space-y-4">
            {[
              {
                question: "How fast is delivery?",
                answer: "Your full bundle is delivered in 7 days from our kickoff call."
              },
              {
                question: "What if I need extra pages?",
                answer: "We can add extra pages for a fixed fee. Just ask on your intro call."
              },
              {
                question: "Can you run my ads too?",
                answer: "Yes! Ask on the call for a custom quote for ongoing ads management."
              },
              {
                question: "Do I keep my website if I cancel monthly?",
                answer: "Yes - your website is 100% yours, even if you cancel the Growth Plan."
              }
            ].map((item, i) => (
              <div key={i} className="group">
                <div 
                  className="flex items-start justify-between p-6 bg-[#0f0f0f]/50 backdrop-blur-sm border border-white/5 rounded-xl cursor-pointer transition-all duration-300 hover:border-[#ffb700]/30 group-hover:bg-[#0f0f0f]/70"
                  onClick={() => toggleFAQ(i)}
                >
                  <h3 className="text-lg font-bold text-white pr-4">{item.question}</h3>
                  <div className={`flex-shrink-0 ml-4 mt-1 transform transition-transform duration-300 ${openFAQ === i ? 'rotate-180' : ''}`}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19 9L12 16L5 9" stroke="#ffb700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
                <div className={`overflow-hidden transition-all duration-300 ${openFAQ === i ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="px-6 pb-6 pt-2 text-white/80">
                    <p>{item.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* CTA */}
          <div className="mt-12 text-center">
            <p className="text-white/80 mb-6">
              Still have questions? We're here to help.
            </p>
            <BusinessBundleBookingButton
              className="group relative inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-[#ffb700] to-[#ff8c00] text-black font-bold rounded-xl hover:scale-105 transform transition-all duration-300 text-base shadow-lg hover:shadow-[#ffb700]/30 border-2 border-[#ffb700]"
              trackingLabel="free_consultation_cta"
            >
              <span className="relative z-10">📞 Book a Free Consultation</span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#ff8c00] to-[#ffb700] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </BusinessBundleBookingButton>
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section id="book" className="bg-gradient-to-b from-[#0a0a0a] to-[#121212] relative overflow-hidden py-20 border-t border-white/5">
        <div className="container mx-auto px-4 max-w-4xl relative z-10">
          {/* Section Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-2 h-2 bg-[#ffb700] rounded-full"></div>
              <span className="text-[#ffb700] text-sm font-bold uppercase tracking-wider">Get Started</span>
              <div className="w-2 h-2 bg-[#ffb700] rounded-full"></div>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4">
              Book Your <span className="text-[#ffb700]">Spot</span>
            </h2>
            <p className="text-white/70 max-w-2xl mx-auto">
              Limited availability. Secure your bundle before the price increases.
            </p>
          </div>
          
          {/* Form Container */}
          <div className="bg-[#0f0f0f]/50 backdrop-blur-sm border border-white/5 rounded-2xl p-4 sm:p-6 md:p-8 lg:p-10 max-w-2xl mx-auto">
            {formSubmitted ? (
              <div className="text-center py-8">
                <div className="text-green-400 text-6xl mb-4">✅</div>
                <h3 className="text-2xl font-bold text-white mb-2">Form Submitted Successfully!</h3>
                <p className="text-white/70 mb-6">Thank you for your interest in our Business Bundle. We'll get back to you within 24 hours.</p>
                <BusinessBundleBookingButton
                  className="inline-block bg-[#ffb700] hover:bg-[#ff8c00] text-black font-bold py-3 px-6 rounded-lg transition-colors"
                  trackingLabel="form_success_cta"
                >
                  Book Your Free Strategy Call
                </BusinessBundleBookingButton>
              </div>
            ) : (
            <form className="space-y-6" onSubmit={handleFormSubmit}>
              {formError && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-4">
                  <p className="text-red-400 text-sm">{formError}</p>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-white/80 text-sm font-medium">Name</label>
                  <input 
                    name="name"
                    type="text" 
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-3 py-2 sm:px-4 sm:py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#ffb700] focus:border-transparent transition-all duration-200 text-sm sm:text-base" 
                    placeholder="Your name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-white/80 text-sm font-medium">Email</label>
                  <input 
                    name="email"
                    type="email" 
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-3 py-2 sm:px-4 sm:py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#ffb700] focus:border-transparent transition-all duration-200 text-sm sm:text-base" 
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-white/80 text-sm font-medium">Phone</label>
                  <input 
                    name="phone"
                    type="tel" 
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-3 py-2 sm:px-4 sm:py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#ffb700] focus:border-transparent transition-all duration-200 text-sm sm:text-base" 
                    placeholder="+44"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-white/80 text-sm font-medium">Business Type</label>
                  <select 
                    name="businessType"
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#ffb700] focus:border-transparent transition-all duration-200 appearance-none"
                    required
                  >
                    <option value="">Select business type</option>
                    <option value="local">Local Service</option>
                    <option value="ecommerce">E-commerce</option>
                    <option value="agency">Agency</option>
                    <option value="saas">SaaS</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="block text-white/80 text-sm font-medium">How can we help you? <span className="text-white/40">(Optional)</span></label>
                <textarea 
                  name="message"
                  rows="3" 
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-3 py-2 sm:px-4 sm:py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#ffb700] focus:border-transparent transition-all duration-200 resize-none text-sm sm:text-base"
                  placeholder="Tell us about your project..."
                ></textarea>
              </div>
              
              <div className="pt-2">
                <button 
                  type="submit" 
                  className="group relative w-full flex items-center justify-center px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-[#ffb700] to-[#ff8c00] text-black font-bold rounded-xl hover:scale-[1.02] transform transition-all duration-300 text-base sm:text-lg shadow-lg hover:shadow-[#ffb700]/30 border-2 border-[#ffb700] overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <span>🚀</span>
                    <span>Secure My Spot</span>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#ff8c00] to-[#ffb700] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>
                <div className="mt-4 p-3 bg-[#0a0a0a]/50 rounded-lg border border-white/5">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <svg className="w-4 h-4 text-[#ffb700]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span className="text-[#ffb700] text-xs font-bold">PRIVACY GUARANTEE</span>
                  </div>
                  <p className="text-center text-white/60 text-xs leading-relaxed">
                    🔒 Your data is 100% secure • We never spam or share your information • GDPR compliant • 24-hour response guarantee
                  </p>
                </div>
              </div>
            </form>
            )}
          </div>
        </div>
      </section>

      {/* START: Social Proof Section */}
      <section className="bg-gradient-to-br from-[#121212] via-[#0a0a0a] to-[#121212] py-16 md:py-20 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-[#fdbd18]/5 blur-3xl animate-pulse" />
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
          {/* Testimonial Carousel */}
          <div className="text-center mb-12">
            <span className="inline-block bg-[#fdbd18] text-black font-bold py-2 px-4 rounded-full text-sm uppercase tracking-wider shadow-lg mb-6">
              Client Success Stories
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#fdbd18] to-[#ff8c00] mb-8">
              Real Results from Real UK Businesses
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
            {[
              {
                quote: "Delivered our site in 7 days! Doubled our leads with AI chatbot integration.",
                author: "Sarah M.",
                company: "MyApproved.com",
                rating: 5
              },
              {
                quote: "Professional, efficient, and results-driven. Our conversion rate increased by 40%.",
                author: "James K.",
                company: "Identi Solutions",
                rating: 5
              },
              {
                quote: "The AI automation saved us 20 hours per week. ROI was immediate.",
                author: "Lisa R.",
                company: "Omni Digital",
                rating: 5
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-[#1a1a1a]/90 backdrop-blur-sm border-2 border-[#fdbd18]/20 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <span key={i} className="text-[#fdbd18] text-lg">★</span>
                  ))}
                </div>
                <p className="text-white/90 mb-4 italic">"{testimonial.quote}"</p>
                <div className="text-sm">
                  <p className="text-[#fdbd18] font-semibold">{testimonial.author}</p>
                  <p className="text-white/60">{testimonial.company}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Trust Badges */}
          <div className="text-center">
            <h3 className="text-xl font-bold text-white mb-6">Trusted & Certified</h3>
            <div className="flex justify-center items-center gap-8 flex-wrap">
              <div className="flex items-center gap-2 bg-[#1a1a1a]/90 border border-[#fdbd18]/30 rounded-lg px-4 py-2">
                <span className="text-green-400 text-lg">🔒</span>
                <span className="text-white text-sm font-medium">SSL Secure</span>
              </div>
              <div className="flex items-center gap-2 bg-[#1a1a1a]/90 border border-[#fdbd18]/30 rounded-lg px-4 py-2">
                <span className="text-blue-400 text-lg">🇬🇧</span>
                <span className="text-white text-sm font-medium">UK-Based</span>
              </div>
              <div className="flex items-center gap-2 bg-[#1a1a1a]/90 border border-[#fdbd18]/30 rounded-lg px-4 py-2">
                <span className="text-[#fdbd18] text-lg">🤖</span>
                <span className="text-white text-sm font-medium">AI Certified</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* END: Social Proof Section */}

      {/* START: Pricing Clarity Section */}
      <section className="bg-black text-white py-16 md:py-20 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-1/2 right-1/4 h-96 w-96 rounded-full bg-[#fdbd18]/5 blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-12 relative z-10 text-center">
          <div className="max-w-3xl mx-auto">
            <span className="inline-block bg-[#fdbd18] text-black font-bold py-2 px-4 rounded-full text-sm uppercase tracking-wider shadow-lg mb-6">
              Transparent Pricing
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#fdbd18] to-[#ff8c00] mb-6">
              No Hidden Fees. No Surprises.
            </h2>
            <p className="text-xl md:text-2xl text-white/90 mb-8">
              Packages from <span className="text-[#fdbd18] font-bold">£750</span>. Clear, fixed pricing - no hidden fees.
            </p>
            <BusinessBundleBookingButton
              className="inline-flex items-center justify-center bg-gradient-to-r from-[#fdbd18] to-[#ff8c00] hover:from-[#ff8c00] hover:to-[#fdbd18] text-black font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 text-lg border-2 border-[#fdbd18]"
              trackingLabel="pricing_section"
            >
              💰 Get My Quote
            </BusinessBundleBookingButton>
          </div>
        </div>
      </section>
      {/* END: Pricing Clarity Section */}

      {/* START: Deliverables Section */}
      <section className="bg-gradient-to-br from-[#0a0a0a] via-[#121212] to-[#1a1a1a] py-16 md:py-24 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-1/3 left-1/3 h-96 w-96 rounded-full bg-[#ffb700]/5 blur-3xl animate-pulse" />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="bg-[#1a1a1a]/90 backdrop-blur-sm border-2 border-[#ffb700]/20 rounded-3xl p-2 shadow-2xl">
                <div className="bg-gradient-to-br from-[#ffb700]/10 to-[#ff8c00]/10 rounded-2xl p-8">
                  <div className="text-center mb-6">
                    <span className="inline-block bg-[#ffb700] text-[#222] font-bold py-2 px-4 rounded-full text-sm uppercase tracking-wider shadow-lg mb-4">
                      Bundle Explainer
                    </span>
                    <div className="w-full h-64 bg-[#0a0a0a] rounded-xl flex items-center justify-center border-2 border-[#ffb700]/30">
                      <div className="text-center">
                        <div className="text-6xl mb-4">🎬</div>
                        <p className="text-[#ffb700] font-semibold">Explainer Video Coming Soon</p>
                        <p className="text-[#ADB7BE] text-sm">Visual breakdown of your bundle</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-4xl md:text-5xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-[#ffb700] to-[#ff8c00]">
                Here's What You Get
              </h2>
              <ul className="space-y-4 mb-8">
                {[
                  "✔️ Custom Website (AI-powered)",
                  "✔️ Chatbot & Voice Agent",
                  "✔️ Google Business Setup",
                  "✔️ Social Media Launch (8 posts)",
                  "✔️ 7-Day Delivery & 14-Day Revisions",
                  "✔️ 1-Year Hosting",
                  "✔️ After-Launch Support"
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3 text-white text-lg">
                    <span className="text-[#ffb700] text-xl">{item.split(' ')[0]}</span>
                    <span>{item.substring(3)}</span>
                  </li>
                ))}
              </ul>
              <div className="bg-gradient-to-r from-red-500/20 to-red-600/20 border-2 border-red-500/50 rounded-xl p-4 mb-6">
                <p className="text-white font-bold text-center">
                  <span className="text-red-400">⚡ Only 2 spots left this month!</span>
                </p>
              </div>
              <BusinessBundleBookingButton
                className="inline-flex items-center justify-center bg-gradient-to-r from-[#ffb700] to-[#ff8c00] hover:from-[#ff8c00] hover:to-[#ffb700] text-[#222] font-bold py-4 px-8 rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 text-lg border-2 border-[#ffb700]"
                trackingLabel="deliverables_secure_spot"
              >
                Secure My Spot →
              </BusinessBundleBookingButton>
            </div>
          </div>
        </div>
      </section>
      {/* END: Deliverables Section */}

      {/* START: FAQ SECTION */}
      <section className="bg-gradient-to-br from-[#121212] via-[#0a0a0a] to-[#121212] py-16 md:py-24 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-1/4 right-1/4 h-96 w-96 rounded-full bg-[#ffb700]/5 blur-3xl" />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
          <div className="text-center mb-12">
            <span className="inline-block bg-[#ffb700] text-[#222] font-bold py-2 px-4 rounded-full text-sm uppercase tracking-wider shadow-lg mb-6">
              FAQ
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#ffb700] to-[#ff8c00] mb-4">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="max-w-4xl mx-auto space-y-4">
            {[
              {
                question: "What's included in the Business Bundle?",
                answer: "You get a full website, AI chatbot & voice agent, Google Business setup, 7-day launch, hosting, and more."
              },
              {
                question: "How long does it take?",
                answer: "The full system is delivered in 7 days, with 14-day revisions included."
              },
              {
                question: "Can I make changes later?",
                answer: "Yes – the package includes 14 days of revisions and full access for edits."
              }
            ].map((faq, index) => (
              <details key={index} className="bg-[#1a1a1a]/90 backdrop-blur-sm border-2 border-[#ffb700]/20 hover:border-[#ffb700]/40 rounded-xl transition-all duration-300 shadow-lg">
                <summary className="cursor-pointer p-6 text-white font-semibold text-lg hover:text-[#ffb700] transition-colors duration-300">
                  {faq.question}
                </summary>
                <div className="px-6 pb-6 text-[#ADB7BE] leading-relaxed">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
        
        {/* FAQ Schema */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "What's included in the Business Bundle?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "You get a full website, AI chatbot & voice agent, Google Business setup, 7-day launch, hosting, and more."
                }
              },
              {
                "@type": "Question",
                "name": "How long does it take?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "The full system is delivered in 7 days, with 14-day revisions included."
                }
              },
              {
                "@type": "Question",
                "name": "Can I make changes later?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes – the package includes 14 days of revisions and full access for edits."
                }
              }
            ]
          })
        }} />
        
        {/* START: Product Schema */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": "Business Launch Bundle",
            "description": "AI-Powered Website + Lead Generation System launched in 7 days. Includes website, chatbot, voice agent, SEO, social media, and analytics.",
            "image": "https://www.khamareclarke.com/images/business-bundle-hero.jpg",
            "brand": {
              "@type": "Brand",
              "name": "Khamare Clarke"
            },
            "review": {
              "@type": "Review",
              "reviewRating": {
                "@type": "Rating",
                "ratingValue": "5",
                "bestRating": "5"
              },
              "author": {
                "@type": "Person",
                "name": "Verified UK Client"
              }
            },
            "offers": {
              "@type": "Offer",
              "priceCurrency": "GBP",
              "price": "699",
              "availability": "https://schema.org/InStock"
            }
          })
        }} />
        {/* END: Product Schema */}
      </section>
      {/* END: FAQ SECTION */}

      {/* Lead Magnet - 7-Figure AI Playbook - Horizontal Layout */}
      <section className="bg-gradient-to-br from-[#0a0a0a] via-[#121212] to-[#1a1a1a] py-16 md:py-24 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-1/4 right-1/4 h-96 w-96 rounded-full bg-[#ffb700]/5 blur-3xl" />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
          {/* Horizontal Container */}
          <div className="bg-gradient-to-r from-[#ffb700] via-[#ff8c00] to-[#ffb700] rounded-3xl p-1 shadow-2xl">
            <div className="bg-[#0a0a0a] rounded-3xl overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-3 min-h-[500px]">
                
                {/* Left Content Section - Takes up 2/3 of width */}
                <div className="lg:col-span-2 p-8 md:p-12 flex flex-col justify-center">
                  <div className="max-w-2xl">
                    <span className="inline-block bg-[#ffb700] text-[#222] font-bold py-2 px-6 rounded-full text-sm uppercase tracking-wider shadow-lg mb-6">
                      FREE DOWNLOAD
                    </span>
                    
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#ffb700] to-[#ff8c00] mb-6 leading-tight">
                      The 7-Figure AI Playbook for UK Businesses
                    </h2>
                    
                    <p className="text-white text-lg md:text-xl mb-8 leading-relaxed">
                      Get instant access to the exact AI systems and automations that have generated over <span className="text-[#ffb700] font-bold">£12,000,000+</span> in revenue for UK businesses. This comprehensive playbook reveals:
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                      <div className="flex items-start gap-3 text-white/90">
                        <span className="text-[#ffb700] mt-1">•</span>
                        <span className="text-base">7 proven AI workflows that save 20+ hours/week</span>
                      </div>
                      <div className="flex items-start gap-3 text-white/90">
                        <span className="text-[#ffb700] mt-1">•</span>
                        <span className="text-base">Client acquisition systems that consistently fill your pipeline</span>
                      </div>
                      <div className="flex items-start gap-3 text-white/90">
                        <span className="text-[#ffb700] mt-1">•</span>
                        <span className="text-base">Revenue-boosting automations you can implement today</span>
                      </div>
                      <div className="flex items-start gap-3 text-white/90">
                        <span className="text-[#ffb700] mt-1">•</span>
                        <span className="text-base">Exclusive case studies from successful UK businesses</span>
                      </div>
                      <div className="flex items-start gap-3 text-white/90 md:col-span-2">
                        <span className="text-[#ffb700] mt-1">•</span>
                        <span className="text-base">Step-by-step implementation guides</span>
                      </div>
                    </div>
                    
                    <p className="text-[#ADB7BE] text-base">
                      Designed for operators who want plug-and-play leverage in under 10 minutes.
                    </p>
                  </div>
                </div>
                
                {/* Right Form Section - Takes up 1/3 of width */}
                <div className="lg:col-span-1 bg-[#ffb700] p-8 md:p-12 flex flex-col justify-center">
                  <div className="bg-white rounded-2xl p-6 shadow-xl">
                    <div className="text-center mb-6">
                      <div className="text-5xl mb-4">📚</div>
                      <h3 className="text-xl font-bold text-black mb-4">What's Inside:</h3>
                      <div className="text-left space-y-2 text-sm text-black mb-6">
                        <div className="flex items-center gap-2">
                          <span className="text-green-600">✓</span>
                          <span>50+ Page Playbook</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-green-600">✓</span>
                          <span>12 AI Automation Templates</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-green-600">✓</span>
                          <span>Video Walkthroughs</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-green-600">✓</span>
                          <span>Exclusive Bonuses</span>
                        </div>
                      </div>
                    </div>
                    
                    <form className="space-y-4">
                      <input 
                        type="text" 
                        placeholder="Your Name" 
                        required
                        className="w-full rounded-lg px-4 py-3 border-2 border-gray-200 focus:border-[#ffb700] focus:outline-none text-black bg-white placeholder-gray-500 font-medium transition-all duration-300" 
                      />
                      <input 
                        type="email" 
                        placeholder="Your Email" 
                        required
                        className="w-full rounded-lg px-4 py-3 border-2 border-gray-200 focus:border-[#ffb700] focus:outline-none text-black bg-white placeholder-gray-500 font-medium transition-all duration-300" 
                      />
                      
                      <CTAButton
                        type="submit"
                        className="w-full py-4 text-lg bg-black text-white font-bold rounded-lg hover:bg-gray-800 transition-all duration-300 shadow-lg"
                        icon="download"
                        eventLabel="download_playbook_business_bundle"
                        useBookingWidget={false}
                      >
                        <span className="flex items-center justify-center gap-2">
                          <span>⬇️</span>
                          <span>Get Instant Access Now</span>
                        </span>
                      </CTAButton>
                      
                      <p className="text-center text-gray-600 text-xs leading-relaxed">
                        🔒 100% secure. No spam. Unsubscribe anytime.
                      </p>
                    </form>
                  </div>
                </div>
                
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Policies note */}
      <section className="bg-[#121212] py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          <p className="text-center text-white text-base font-semibold">Policies • Limited spots • Upfront clarity • Satisfaction-first</p>
        </div>
      </section>

      {/* Sticky Mobile CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-[#ffb700] to-[#ff8c00] p-3 sm:p-4 z-40 md:hidden border-t-2 border-[#ffb700] shadow-2xl transition-transform duration-300 pb-safe" id="mobile-cta">
        <div className="flex flex-col items-center w-full">
          <BusinessBundleBookingButton
            className="block w-full text-center bg-black text-white font-bold py-3 sm:py-4 rounded-xl text-base sm:text-lg shadow-lg active:scale-95 transition-transform duration-150"
            trackingLabel="mobile_sticky_cta"
          >
            🚀 Secure My £699 Spot Now
          </BusinessBundleBookingButton>
          <div className="mt-1 text-center text-[11px] leading-tight text-black/80 font-semibold">
            Designed for business owners ready to move fast with upfront pricing.
          </div>
        </div>
      </div>
      
      <style jsx global>{`
        @keyframes bounce-horizontal {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(4px); }
        }
        .animate-bounce-horizontal {
          animation: bounce-horizontal 1.5s infinite;
        }
        
        /* Mobile safe area handling */
        .pb-safe {
          padding-bottom: max(12px, env(safe-area-inset-bottom));
        }
        
        /* Ensure mobile CTA doesn't overlap with browser UI */
        @media (max-width: 768px) {
          #mobile-cta {
            bottom: env(safe-area-inset-bottom, 0px);
          }
        }
        
        /* Extra small screens - hide some text to prevent overflow */
        @media (max-width: 375px) {
          .xs\\:hidden {
            display: none !important;
          }
          .xs\\:inline {
            display: inline !important;
          }
        }
      `}</style>

      {/* START: Sticky CTA Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-black text-white flex justify-center py-3 px-4 z-40 border-t-2 border-[#fdbd18]/30 backdrop-blur-sm">
        <BusinessBundleBookingButton
          className="bg-gradient-to-r from-[#fdbd18] to-[#ff8c00] hover:from-[#ff8c00] hover:to-[#fdbd18] text-black font-bold py-3 px-6 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 text-sm sm:text-base"
          trackingLabel="sticky_cta"
        >
          📞 Book Your Free Growth Call
        </BusinessBundleBookingButton>
      </div>
      {/* END: Sticky CTA Bar */}

      {/* START: WhatsApp Floating Button */}
      <a
        href="https://wa.me/447366490007?text=Hi%20Khamare,%20I'm%20interested%20in%20the%20AI%20Business%20Growth%20Bundle"
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => {
          if (typeof gtag !== 'undefined') {
            gtag('event', 'whatsapp_click', {
              event_category: 'engagement',
              event_label: 'floating_button'
            });
          }
        }}
        className="fixed bottom-20 right-4 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 z-50"
        title="Chat on WhatsApp"
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
        </svg>
      </a>
      {/* END: WhatsApp Floating Button */}
      
      <CookieBanner />
export default function BusinessBundlePage() {
  return <BusinessBundleClientContent />;
}