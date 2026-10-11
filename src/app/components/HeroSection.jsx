"use client";
import React from "react";
import Image from "next/image";
import BookingButton from './BookingButton';

const HeroSection = () => {
  // Top spacing comes from `.page-top` on the Section wrapper in page.js, which applies
  // the fixed navbar's measured height plus 24px. The hero must not add top padding of
  // its own or the two would compound.
  return (
    <section className="pt-0 pb-0 bg-surface">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 lg:gap-8 items-center border-b border-white/10 lg:pb-0">
          {/* Text is left aligned by default now that the old blanket mobile centring
              rule is gone (globals.css), so the hero opts back in below 768px with
              `center-mobile` (globals.css owns that rule). The eyebrow is a flex row,
              so it needs `flex-center-mobile`; text-align cannot move flex items.
              Both drop away from 768px up, where the two-column layout returns. */}
          <div className="lg:col-span-8 center-mobile">
            {/* Restored to the original eyebrow. The flanking dashes were changed to the
                `gold-rule` class at some point, which is an ANIMATED gold gradient — and
                once the gold started swinging its angle they pulsed, which is wrong for
                two 40px hairlines. They are back to the plain static fade they started
                as: transparent into the primary gold. The label is back to its original
                size and tracking too. Kept deliberately: the reveal classes (every hero
                element carries them), and `flex-center-mobile`, which is what centres
                this row on a phone. */}
            <div className="reveal reveal-blur flex items-center gap-4 mb-5 h-4 flex-center-mobile" style={{ "--rv-delay": "60ms" }}>
              <span className="h-[2px] w-10 shrink-0 bg-gradient-to-r from-transparent to-primary -translate-y-[7px]" aria-hidden="true" />
              <p className="text-xs font-semibold tracking-[0.18em] uppercase gold-text leading-none whitespace-nowrap">
                AI Implementation Specialist
              </p>
              <span className="h-[2px] w-10 shrink-0 bg-gradient-to-l from-transparent to-primary -translate-y-[7px]" aria-hidden="true" />
            </div>

            <h1 className="reveal reveal-blur font-black leading-none tracking-tight text-white text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl" style={{ "--rv-delay": "180ms", "--rv-blur": "18px" }}>
              Khamare <span className="gold-text">Clarke</span>
            </h1>

            <p className="reveal reveal-blur text-sm sm:text-base font-semibold tracking-[0.1em] uppercase gold-text leading-none m-0 -mt-4" style={{ "--rv-delay": "340ms" }}>
              MSc Computer Science &amp; AI
            </p>

            <p className="reveal reveal-blur mt-4 sm:mt-6 text-xl lg:text-2xl max-w-3xl text-muted leading-relaxed" style={{ "--rv-delay": "460ms" }}>
              Practical AI implementation for SMEs, built for scale, security and compliance.
            </p>

            <div className="reveal mt-5 sm:mt-7" style={{ "--rv-delay": "600ms" }}>
              <BookingButton
                className="inline-flex items-center justify-center bg-crimson hover:bg-crimson hover:brightness-110 text-white font-black rounded-lg transition-all duration-200 text-lg lg:text-xl px-10 py-5 lg:px-12 lg:py-6 border-2 border-[#ff3b3b] shadow-[0_0_30px_-4px_rgba(255,30,30,0.6)]"
                trackingLabel="hero_book_consultation"
              >
                <span>Book a Consultation</span>
              </BookingButton>
              <p className="gold-text mt-3 text-base sm:text-lg font-semibold leading-snug [text-wrap:balance]">
                30 minutes. An honest look at where AI fits.
              </p>
            </div>
          </div>

          {/* `relative isolate` kept the stacking context for the gold key light that
              used to sit behind the portrait. The light has been removed, so neither
              class does anything now, but they are harmless and neither affects layout:
              the column still occupies exactly the same grid track. */}
          <div
            className="relative isolate reveal-img reveal-blur lg:col-span-4 self-stretch"
            style={{ "--rv-delay": "320ms", "--rv-blur": "16px" }}
          >
            <Image
              src="/images/hero-image.png"
              alt="Khamare Clarke, AI Specialist for SMEs"
              className="w-full h-full object-cover"
              width={550}
              height={550}
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
