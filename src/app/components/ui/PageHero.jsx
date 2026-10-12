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
 *   size="hero"    ds-heading-1      up to 128px — SHORT display titles
 *   size="compact" ds-heading-2-sm   up to  44px — LONG keyword-led titles
 *
 * The rule, so this stays consistent as pages are migrated rather than becoming a
 * per-page whim: if the h1 is roughly a name or a two-to-three word phrase, it is
 * `hero` (/about — "Khamare Clarke"). If it is a sentence-like keyword phrase, it is
 * `compact` (/services/[service]/[location] — "AI Implementation Specialist in
 * Stoke-on-Trent"), because a 128px cap would turn a long title into a wall.
 *
 * Left-aligned rather than centred on mobile, unlike the homepage hero. The homepage
 * hero is a display panel; these are prose pages, where a centred paragraph has no
 * consistent left edge for the eye to return to. Pages that want the centred
 * treatment can add `center-mobile`.
 *
 * @param {string} eyebrow - gold label above the title
 * @param {React.ReactNode} title - the h1
 * @param {React.ReactNode} [lede] - introductory paragraph
 * @param {'hero'|'compact'} [size='hero']
 */
const titleSizes = {
  hero: "ds-heading-1 text-white",
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
