"use client";
import React from "react";
import Image from "next/image";
import BookingButton from './BookingButton';

const HeroSection = () => {
  return (
    <section className="pt-4 pb-0 sm:pt-8 lg:pt-24 bg-surface">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center border-b border-white/10 lg:pb-0">
          <div className="lg:col-span-8">
            <div className="flex items-center gap-4 mb-5 h-4">
              <span className="h-[2px] w-10 shrink-0 bg-gradient-to-r from-transparent to-primary -translate-y-[7px]" aria-hidden="true" />
              <p className="text-xs font-semibold tracking-[0.18em] uppercase gold-text leading-none whitespace-nowrap">
                AI Implementation Specialist
              </p>
              <span className="h-[2px] w-10 shrink-0 bg-gradient-to-l from-transparent to-primary -translate-y-[7px]" aria-hidden="true" />
            </div>

            <h1 className="font-black leading-none tracking-tight text-white text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl">
              Khamare <span className="gold-text">Clarke</span>
            </h1>

            <p className="text-xs font-semibold tracking-[0.18em] uppercase gold-text leading-none m-0 -mt-4">
              MSc Computer Science &amp; AI
            </p>

            <p className="mt-5 text-base lg:text-lg max-w-2xl text-muted leading-relaxed">
              Practical AI implementation for SMEs, built for scale, security and compliance.
            </p>

            <div className="mt-7">
              <BookingButton
                className="inline-flex items-center justify-center bg-gold hover:bg-gold hover:brightness-110 text-surface font-black rounded-lg transition-all duration-200 text-lg lg:text-xl px-10 py-5 lg:px-12 lg:py-6 border-2 border-primary"
                trackingLabel="hero_book_consultation"
              >
                <span>Book a Consultation</span>
              </BookingButton>
              <p className="mt-3 text-[11px] sm:text-xs text-white/50 leading-snug">
                30 minutes. An honest look at where AI fits.
              </p>
            </div>
          </div>

          <div className="lg:col-span-4 self-stretch">
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
