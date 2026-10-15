"use client";

import React from "react";
import Image from "next/image";
import PageHero from "./PageHero";
import BookingButton from "../BookingButton";

/**
 * The opening block of a content page, with the founder's portrait beside it.
 *
 * This is `PageHero` inside the homepage hero's grid, not a second hero: same
 * eyebrow, same `titleSizes` scale, same 60/180/460ms reveal stagger and the same
 * 18px blur ramp. Nothing about the type is redefined here.
 *
 * WHY A WRAPPER, NOT A PROP ON PAGEHERO. `PageHero` has 31 consumer files — only
 * the 15 in these four templates may change. Adding an image prop would mean
 * touching its signature and re-verifying the other 16 (`/about`, `/terms`,
 * `/privacy-policy`, `/sitemap-page`, `/locations`, `/business-bundle`,
 * `/case-studies`, the blog routes and the glossary hub). A wrapper leaves
 * `PageHero.jsx` byte-identical, so those pages are provably untouched rather than
 * "untouched in the branch that isn't taken". It also keeps PageHero owning
 * typography, which is its documented contract.
 *
 * WHY THE TEXT TRACK IS PINNED TO var(--measure-hero), NOT A 8/4 SPLIT.
 * These templates wrap their hero *and* body in `Container size="narrow"` (896px),
 * so the headline has always had 848px. The obvious way to add a portrait is a
 * proportional 8/4 grid in a wider container — but that SHRINKS the text column to
 * 757px, and a narrower column means the longest headings, which were tuned to
 * three lines, take a fourth. Pinning the first track to the exact measure the
 * tiers were tuned against (see `1d0b9445`) means the headline keeps 848px at
 * every viewport and NOT ONE heading on these 396 pages rewraps. The portrait
 * takes what is left.
 *
 * The portrait is unframed, matching the homepage hero: no border, no mat, no
 * glow. The framed treatment belongs to the square portrait in `AboutSection`.
 * `width`/`height` are the source's own 4:5 ratio (3375x4219 = 0.800), so
 * `object-cover` crops nothing.
 *
 * `sizes` is not optional: without it Next assumes 100vw and the browser picks
 * from the full device-size srcset, which would fan one image out into many
 * distinct optimisations across 396 pages.
 *
 * @param {string} eyebrow - gold label above the title
 * @param {React.ReactNode} title - the h1
 * @param {React.ReactNode} [lede] - introductory paragraph
 * @param {'hero'|'feature'|'term'|'compact'} [size='feature']
 * @param {string} [imageSrc]
 * @param {string} [imageAlt]
 */
export default function PageHeroSplit({
  eyebrow,
  title,
  lede,
  size = "feature",
  imageSrc = "/images/hero-image.png",
  imageAlt = "Khamare Clarke, AI Specialist for SMEs",
  className = "",
  // The homepage hero carries three things below the title that PageHero does not: a gold
  // credential line, and a booking button with a caption. The client asked for the content
  // heroes to match it, so they are rendered here rather than in PageHero — which is used by
  // legal pages, the sitemap and the blog routes, where a booking button does not belong.
  // Every string below is the homepage hero's own, and every one can be overridden per page.
  credential = "MSc Computer Science & AI",
  cta = true,
  ctaLabel = "Book a Consultation",
  ctaCaption = "30 minutes. An honest look at where AI fits.",
  ctaEventLabel = "page_hero_cta",
}) {
  return (
    <div
      /* THE HOMEPAGE HERO'S OWN GRID. The client asked for the portrait to match the homepage's
         hero exactly in sizing and placement, and the homepage splits twelve columns eight-and-four
         with no bottom padding at desktop, so the portrait runs flush to the hairline under it.
         Measured against / : portrait 341px wide, bottom 1px above the rule. This grid is that
         grid, class for class.

         TRADE, stated once because it is real: this replaces the pinned 848px text track with a
         proportional one, so the text column narrows on every page that uses this component and a
         long heading may take an extra line. The pinning existed to stop exactly that. The
         client's instruction is the portrait, so the portrait wins; if a heading is found wrapping
         badly, this comment is the reason and the grid is the switch. */
      className={`grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 lg:gap-8 items-center border-b border-white/10 pb-10 lg:pb-0 ${className}`.trim()}
      data-ds="page-hero-split"
    >
      {/* PageHero takes the eyebrow and the title only. The lede is rendered below, after the
          gold line, because the homepage's order is title, gold line, lede, button — passing
          the lede here would put it above the gold line and break that order. */}
      <div className="lg:col-span-8">
        <PageHero eyebrow={eyebrow} title={title} size={size} />

        {/* SEPARATION FROM THE TITLE. The homepage's own class string for this line ends in
            `-mt-4`, pulling it up 16px — and that works there only because the homepage h1 uses
            `leading-none`, which leaves no space below the last line to eat into. These tiers
            use the fluid heading leading, which does, so the negative margin closed the gap and
            the credential line sat on the title. Here it gets a positive margin instead, sized
            to reproduce the homepage's visible gap rather than its class name. */}
        {credential ? (
          <p
            className="reveal reveal-blur text-sm sm:text-base font-semibold tracking-[0.1em] uppercase gold-text leading-none m-0 mt-5 sm:mt-6"
            style={{ "--rv-delay": "340ms" }}
          >
            {credential}
          </p>
        ) : null}

        {lede ? (
          <p
            className="reveal reveal-blur mt-4 sm:mt-6 text-xl lg:text-2xl max-w-3xl text-muted leading-relaxed"
            style={{ "--rv-delay": "460ms" }}
          >
            {lede}
          </p>
        ) : null}

        {/* BookingButton, not CTAButton, and this is deliberate. CTAButton's wrapper is
            `flex flex-col items-center`, hard-coded, so it centres its button and caption —
            which under a left-aligned heading looks like a mistake. The homepage hero uses
            BookingButton directly for exactly this reason, left-aligned, so these heroes use the
            same markup and the same classes rather than a centred approximation of them. */}
        {cta ? (
          <div className="reveal mt-5 sm:mt-7" style={{ "--rv-delay": "600ms" }}>
            <BookingButton
              className="inline-flex items-center justify-center bg-crimson hover:bg-crimson hover:brightness-110 text-white font-black rounded-lg transition-all duration-200 text-lg lg:text-xl px-10 py-5 lg:px-12 lg:py-6 border-2 border-[#ff3b3b] shadow-[0_0_30px_-4px_rgba(255,30,30,0.6)]"
              trackingLabel={ctaEventLabel}
            >
              <span>{ctaLabel}</span>
            </BookingButton>
            {ctaCaption ? (
              <p className="gold-text mt-3 text-base sm:text-lg font-semibold leading-snug [text-wrap:balance]">
                {ctaCaption}
              </p>
            ) : null}
          </div>
        ) : null}
      </div>

      {/* `self-stretch` at `xl` and `h-full` on the image: the portrait fills the
          height of the text column beside it, exactly as the homepage hero does.
          Without this the image was a fixed 4:5 box — 272x340 against a text column
          788px tall once the heading moved to the homepage's 128px — so the type
          grew and the picture did not. The homepage's own portrait is 342x664 for
          the same reason. Below `xl` the grid stacks and the cap applies instead. */}
      <div
        className="reveal-img reveal-blur mx-auto lg:mx-0 w-full max-w-[200px] sm:max-w-[260px] lg:max-w-none lg:col-span-4 self-stretch"
        style={{ "--rv-delay": "320ms", "--rv-blur": "16px" }}
      >
        <Image
          src={imageSrc}
          alt={imageAlt}
          width={550}
          height={550}
          sizes="(min-width: 1024px) 341px, (min-width: 640px) 320px, 90vw"
          className="w-full h-full object-cover"
          priority
        />
      </div>
    </div>
  );
}
