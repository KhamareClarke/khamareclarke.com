import React from "react";
import { Badge } from "./Badge";

/**
 * The opening block of a content page: the gold eyebrow, the h1, and an optional lede.
 *
 * Built from HeroSection.jsx so the two are the same treatment rather than two
 * similar ones — the eyebrow is literally the same component (`ui/Badge`, which is
 * the hero eyebrow with its flanking dashes), and the delays are the hero's own:
 * 60ms / 180ms / 460ms, with the 18px blur ramp the hero h1 uses.
 *
 * The 29 pages this replaces each hand-rolled the eyebrow markup, and they had
 * already drifted — some carried `-translate-y-[7px]` on the dashes, some did not,
 * and the bottom margin varied between mb-6 and mb-8. That is what copy-pasted
 * components do over time; this is the same markup with one definition.
 *
 * SIZE — WHICH ONE TO PICK. The homepage hero h1 bypasses the `--font-size-h1` token
 * and hardcodes `text-5xl … xl:text-9xl`; `ds-heading-1` is that same scale as a
 * token. It caps at 128px, which is right for a two-word display name and wrong for a
 * long keyword-led phrase. Both values below are existing tokens in design-tokens.css;
 * nothing new was invented for this.
 *
 *   size="home"    the homepage h1's own classes   48 → 128px — EXACT homepage hero size
 *   size="hero"    ds-heading-1      up to 128px — SHORT display titles
 *   size="feature" ds-heading-1-md   36 → 80px   — EVERY secondary page
 *   size="compact" ds-heading-2-sm   up to  44px — LONG keyword-led titles
 *
 * `home` exists because the homepage h1 does not use a token at all — it hardcodes
 * `text-5xl … xl:text-9xl`. Nothing fluid reaches 128px at a normal desktop width:
 * `ds-heading-1` is 111.36px at 1440 against the homepage's 128px. So the only way
 * to be genuinely identical at every breakpoint is to reuse the same classes, and
 * that is what this is. It is a deliberate exception to the fluid tiers below, and
 * the one place the site has two mechanisms for one job.
 *
 * The glossary term pages use it. MEASURED COST, accepted knowingly: across their
 * 72 headings, none fits in three lines at this size, 57 of 72 reach five lines or
 * more, and the longest — "Google Business Profile Optimisation: Turning a Listing
 * Into a Local Lead Machine" — runs to nine. The homepage h1 is "Khamare Clarke",
 * fifteen characters; these are forty-seven to eighty-one.
 *
 * `feature` was added because the two original sizes left a gap: a page title that
 * is a keyword phrase is too long for the homepage's 128px cap but too important to
 * sit at the 44px subhead size, which made a secondary hero read as a caption over
 * an empty band.
 *
 * There was briefly a fourth, smaller tier (`term`, capping at 56px) for the
 * glossary, whose titles run to 81 characters against 47 for the longest location
 * heading. It was removed because it made the hero shrink when a reader clicked
 * through from the glossary hub — 111px on the index, 56px on the term — which
 * read as a downgrade. Every secondary page is on `feature` now, and the longest
 * glossary title takes five lines instead of three.
 *
 * The rule, so this stays consistent as pages are migrated rather than becoming a
 * per-page whim: if the h1 is roughly a name or a two-to-three word phrase, it is
 * `hero` (/about — "Khamare Clarke"). Everything else on a secondary page —
 * expertise, location, service, glossary term — is `feature`. `compact` remains
 * only for the shortest keyword-led headings.
 *
 * Left-aligned rather than centred on mobile, unlike the homepage hero. The homepage
 * hero is a display panel; these are prose pages, where a centred paragraph has no
 * consistent left edge for the eye to return to. Pages that want the centred
 * treatment can add `center-mobile`.
 *
 * @param {string} eyebrow - gold label above the title
 * @param {React.ReactNode} title - the h1
 * @param {React.ReactNode} [lede] - introductory paragraph
 * @param {'hero'|'feature'|'term'|'compact'} [size='hero']
 */
const titleSizes = {
  home: "font-black leading-none tracking-tight text-white text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl",
  hero: "ds-heading-1 text-white",
  feature: "ds-heading-1-md text-white",
  compact: "ds-heading-2-sm text-white",
};

export default function PageHero({ eyebrow, title, lede, size = "hero", className = "" }) {
  return (
    <header className={`relative z-10 ${className}`.trim()} data-ds="page-hero">
      {eyebrow ? (
        <div className="reveal reveal-blur mb-5" style={{ "--rv-delay": "60ms" }}>
          <Badge>{eyebrow}</Badge>
        </div>
      ) : null}

      <h1
        className={`reveal reveal-blur ${titleSizes[size] || titleSizes.hero}`}
        style={{ "--rv-delay": "180ms", "--rv-blur": "18px" }}
      >
        {title}
      </h1>

      {lede ? (
        <p
          className="reveal reveal-blur ds-lede text-muted mt-6"
          style={{ "--rv-delay": "460ms" }}
        >
          {lede}
        </p>
      ) : null}
    </header>
  );
}
