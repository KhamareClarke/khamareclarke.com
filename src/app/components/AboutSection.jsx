"use client";

import React from "react";
import Image from "next/image";
import CTAButton from "./CTAButton";

/**
 * The founder block: portrait, who he is, and the consultation CTA.
 *
 * LIFTED VERBATIM from the homepage's own block at `src/app/page.js` lines 56-92,
 * which was itself the restored `ServicesSection`. The markup and the copy are
 * copied rather than re-expressed through `SectionHeading` and tokens on purpose:
 * the requirement is that this reads as the same block as the homepage's, and an
 * "equivalent" rewrite (text-muted instead of the literal colour, a different lede
 * element, a re-derived reveal delay) is the kind of drift that makes two blocks
 * look almost-but-not-quite alike. If the homepage block changes, change both.
 *
 * The heading is an h2, which is correct on every page that uses this: the h1 is
 * the hero above it.
 *
 * The portrait is FRAMED — a mat over `surface-muted`, hairline border, rounded —
 * which is the opposite of the hero portrait in `PageHeroSplit`, and deliberately
 * so: the hero image is the page's opening gesture, this one is a portrait sitting
 * in a page body.
 *
 * NOTE ON REPETITION. The paragraph is identical on every page that renders this.
 * That is a deliberate trade: it is approved copy, and inventing per-page variants
 * would be writing claims on the client's behalf. It already appears on the
 * homepage and on /services.
 *
 * NOTE ON THE CTA. The homepage block ends with a `Book a Consultation` button.
 * On all four of these templates this section sits immediately before `CtaPanel`,
 * so rendering it with the CTA would put two call-to-action panels back to back.
 * `showCta` therefore defaults to true (faithful to the homepage) and the
 * templates pass false.
 *
 * @param {string} [className] - spacing only; the block's own layout is fixed
 * @param {boolean} [showCta=true] - false where a CtaPanel follows immediately
 */
export default function AboutSection({ className = "", showCta = true }) {
  return (
    <div className={className.trim()} data-ds="about-section">
      <div className="mb-10 text-center">
        <h2 className="reveal ds-heading-2 text-white mb-4" style={{ "--rv-delay": "120ms" }}>
          Khamare <span className="gold-text">Clarke</span>
        </h2>

        <p className="reveal ds-lede text-[#ADB7BE] mx-auto" style={{ "--rv-delay": "200ms" }}>
          Twelve years in software engineering, artificial intelligence and machine
          learning. I have worked as an AI Solution Architect and a Google Cloud
          Engineer, and I train AI models. I now apply that same architecture to SMEs,
          using practical AI as a productive tool, not a novelty toy like vibe coders do
          nowadays. A structured audit quickly exposes exactly where a business is
          leaking, and the fix follows fast, not the months manual implementation used
          to take.
        </p>
      </div>

      <div className="reveal-img mx-auto mb-12 max-w-md" style={{ "--rv-delay": "120ms" }}>
        <div className="bg-surface-muted border border-white/10 rounded-lg p-2">
          <Image
            src="/images/about-image.png"
            width={400}
            height={400}
            alt="Khamare Clarke, AI Implementation Specialist"
            className="rounded-lg w-full h-auto aspect-square object-cover"
          />
        </div>
      </div>

      {showCta ? (
        <div className="reveal mt-10 text-center" style={{ "--rv-delay": "420ms" }}>
          <CTAButton
            href="/#contact"
            eventLabel="capability_cta"
            caption="An honest look at where AI is needed."
          >
            Book a Consultation
          </CTAButton>
        </div>
      ) : null}
    </div>
  );
}
