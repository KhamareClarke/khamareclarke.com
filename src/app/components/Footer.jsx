"use client";

import React from "react";
import { Section } from "./ui/Section";
import { Container } from "./ui/Container";

const Footer = () => {
  return (
    <Section
      as="footer"
      className="bg-gradient-to-b from-[#0a0a0a] to-[#121212] border-t border-white/5 pt-20 pb-12 relative overflow-hidden"
    >
      <Container size="main">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 bg-[#ffb700] rounded-full"></div>
              <span className="text-[#ffb700] text-sm font-bold uppercase tracking-wider">About</span>
            </div>
            <p className="text-white/80 mb-4 leading-relaxed text-sm sm:text-base">
              The practical implementation of AI within established organisations. Assessed, built, trained, documented, supported.
            </p>
            <div className="flex gap-4 mt-6">
              <a href="https://www.linkedin.com/in/khamareclarke" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-[#ffb700] transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a href="https://www.instagram.com/khamareclarke" aria-label="Instagram" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-[#ffb700] transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href="mailto:systems@khamare.com"
                aria-label="Email"
                className="text-white/60 hover:text-[#ffb700] transition-colors"
                title="Email us"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-4 text-lg">Quick Links</h3>
            <div className="flex flex-wrap gap-x-2 gap-y-1 text-white/70 text-sm">
              <a href="/" className="hover:text-white transition-colors">Home</a>
              <span>·</span>
              <a href="/about" className="hover:text-white transition-colors">About</a>
              <span>·</span>
              <a href="/services" className="hover:text-white transition-colors">Services</a>
              <span>·</span>
              <a href="/case-studies" className="hover:text-white transition-colors">Case Studies</a>
              <span>·</span>
              <a href="/blog" className="hover:text-white transition-colors">Blog</a>
              <span>·</span>
              <a href="/expertise/seo" className="hover:text-white transition-colors">Expertise</a>
              <span>·</span>
              <a href="/glossary" className="hover:text-white transition-colors">Glossary</a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-[#ffb700] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:systems@khamare.com" className="text-white/80 hover:text-[#ffb700] transition-colors">systems@khamare.com</a>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-[#ffb700] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a
                  href="tel:+447545207215"
                  className="text-white/80 hover:text-[#ffb700] transition-colors"
                >
                  +44 7545 207 215
                </a>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-[#ffb700] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-white/80">Stoke-on-Trent, Staffordshire. Serving organisations UK-wide.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              {/* START: Unified Branding */}
              <p className="text-white/60 text-sm leading-relaxed">
                <span className="text-[#ffb700] font-bold">Khamare Clarke</span> — AI Implementation Specialist | MSc Computer Science with Artificial Intelligence, Keele University (completing 2027)
              </p>
              {/* END: Unified Branding */}
            </div>
            <div className="flex items-center gap-4 flex-wrap justify-center md:justify-end text-sm text-white/50">
              <span className="text-white/60">© 2026 Khamare Clarke.</span>
              <a href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</a>
              <span>·</span>
              <a href="/terms" className="hover:text-white transition-colors">Terms of Service</a>
              <span>·</span>
              <a href="/cookies" className="hover:text-white transition-colors">Cookie Policy</a>
              <span>·</span>
              <a href="/sitemap.xml" className="hover:text-[#ffb700] transition-colors">Sitemap</a>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
};

export default Footer;
