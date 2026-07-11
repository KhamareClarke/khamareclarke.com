'use client';

import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const trackEvent = (category, action, label) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label
    });
  }
};

const EmailSection = () => {
  const [emailSubmitted, setEmailSubmitted] = useState(false);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone') || '',
      subject: formData.get('subject'),
      message: formData.get('message'),
    };

    // Track form submission
    trackEvent('contact', 'submit_form', 'contact_form');

    try {
      const response = await fetch('/api/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setEmailSubmitted(true);
        form.reset();
        trackEvent('contact', 'form_success', 'contact_form');
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      trackEvent('contact', 'form_error', 'contact_form_error');
      alert(`Failed to send message: ${error.message}`);
    }
  }, []);

  return (
    <section
      id="contact"
      className="my-12 py-16 relative"
    >
      <div className="bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary-900 to-transparent rounded-full h-80 w-80 z-0 blur-lg absolute top-3/4 -left-4 transform -translate-x-1/2 -translate-1/2"></div>
      
      <div className="max-w-6xl mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0.85, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-6">
            <span className="bg-transparent border border-[#ffb700] text-[#ffb700] text-xs font-semibold px-4 py-1 rounded-full mb-4 tracking-widest uppercase inline-block">LET'S TALK</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white">
              Book Your Free SEO Strategy Call
            </h2>
          </div>
          <p className="text-[#ADB7BE] text-lg max-w-2xl mx-auto">
            30 minutes. I audit your current SEO live, show you what is holding your rankings back, and send a prioritised action list within 24 hours. Whether we work together or not.
          </p>
        </motion.div>

        {/* Main Content - Horizontal Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left: Benefits & Testimonial */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0.85, x: 0 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Benefits */}
            <div className="space-y-4">
              {[
                { icon: "🎯", title: "100% tailored to your goals", desc: "Custom SEO solutions designed specifically for your business" },
                { icon: "🤝", title: "Honest, no-pressure consultation", desc: "Focused on finding the right fit for your business" },
                { icon: "⚡", title: "24hr response guarantee", desc: "Quick turnaround so you can move fast on opportunities" }
              ].map((benefit, index) => (
                <div key={index} className="flex gap-4 p-5 bg-gradient-to-br from-[#181818]/80 to-[#232323]/90 border border-[#ffb700]/20 rounded-xl hover:border-[#ffb700]/40 transition-all duration-300">
                  <div className="text-2xl flex-shrink-0">{benefit.icon}</div>
                  <div>
                    <h4 className="text-white font-semibold text-base mb-1">{benefit.title}</h4>
                    <p className="text-[#ADB7BE] text-sm">{benefit.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Testimonial */}
            <div className="bg-gradient-to-br from-[#181818]/80 to-[#232323]/90 border-l-4 border-[#ffb700] rounded-r-xl p-6 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-[#ffb700]/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-[#ffb700]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-white text-base italic mb-3">
                  </p>
                  <span className="text-[#ffb700] font-semibold text-sm"></span>
                </div>
              </div>
            </div>
            
            <div className="text-center lg:text-left">
              <p className="text-[#ffb700] font-semibold text-lg">Let's discuss how SEO and AI can build results for your business.</p>
            </div>
          </motion.div>
          
          {/* Right: Contact Form */}
          <motion.div
            className="bg-gradient-to-br from-[#181818]/80 to-[#232323]/90 border-2 border-[#ffb700]/30 shadow-2xl rounded-2xl p-8"
            initial={{ opacity: 0.85, x: 0 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {emailSubmitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-[#ffb700]/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-[#ffb700]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Message Sent Successfully!</h3>
                <p className="text-[#ADB7BE]">We'll get back to you within 24 hours with next steps.</p>
              </div>
            ) : (
              <>
                <div className="text-center mb-6">
                  <div className="flex justify-center mb-4">
                    <Image
                      src="/images/contactimage.png.png"
                      alt="Your Consultant Photo"
                      width={80}
                      height={80}
                      className="object-cover rounded-2xl shadow-lg border-4 border-[#ffb700]"
                      priority
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Get Started Today</h3>
                  <p className="text-[#ADB7BE] text-sm">Fill out the form below and we'll schedule your free AI strategy call</p>
                </div>
                
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <input
                        name="name"
                        type="text"
                        id="name"
                        required
                        aria-label="Your Name"
                        className="w-full px-4 py-3 text-gray-100 bg-[#18191E] border-2 border-[#33353F] rounded-lg focus:border-[#ffb700] focus:outline-none transition-all duration-300 placeholder-[#9CA2A9]"
                        placeholder="Your Name"
                      />
                    </div>
                    <div>
                      <input
                        name="email"
                        type="email"
                        id="email"
                        required
                        aria-label="Your Email Address"
                        className="w-full px-4 py-3 text-gray-100 bg-[#18191E] border-2 border-[#33353F] rounded-lg focus:border-[#ffb700] focus:outline-none transition-all duration-300 placeholder-[#9CA2A9]"
                        placeholder="you@email.com"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <input
                        name="phone"
                        type="tel"
                        id="phone"
                        aria-label="Your Phone Number (Optional)"
                        className="w-full px-4 py-3 text-gray-100 bg-[#18191E] border-2 border-[#33353F] rounded-lg focus:border-[#ffb700] focus:outline-none transition-all duration-300 placeholder-[#9CA2A9]"
                        placeholder="Phone (optional)"
                      />
                    </div>
                    <div>
                      <input
                        name="subject"
                        type="text"
                        id="subject"
                        required
                        aria-label="Subject of Your Inquiry"
                        className="w-full px-4 py-3 text-gray-100 bg-[#18191E] border-2 border-[#33353F] rounded-lg focus:border-[#ffb700] focus:outline-none transition-all duration-300 placeholder-[#9CA2A9]"
                        placeholder="Project, AI, or Consulting"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <textarea
                      name="message"
                      id="message"
                      rows="4"
                      aria-label="Your Message"
                      className="w-full px-4 py-3 text-gray-100 bg-[#18191E] border-2 border-[#33353F] rounded-lg focus:border-[#ffb700] focus:outline-none transition-all duration-300 placeholder-[#9CA2A9] resize-none"
                      placeholder="Tell me about your goals, challenges, or project..."
                    />
                  </div>
                  
                  <button
                    type="submit"
                    aria-label="Submit Contact Form"
                    className="group relative inline-flex items-center justify-center w-full py-4 px-6 text-lg font-black text-black bg-gradient-to-r from-[#fdbd18] to-[#ff8c00] rounded-2xl shadow-xl hover:shadow-[#fdbd18]/50 transform hover:scale-[1.02] transition-all duration-300 border-2 border-[#fdbd18] overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      <span>📞</span>
                      <span>Send My Message →</span>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-[#ff8c00] to-[#fdbd18] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </button>
                  
                  <div className="text-center pt-2">
                    <p className="text-[#ADB7BE] text-xs">No pitch deck. No obligation.</p>
                  </div>
                </form>
              </>
            )}
          </motion.div>
          
        </div>
      </div>
    </section>
  );
};

// No need for dynamic import since we're using 'use client'
export default EmailSection;
