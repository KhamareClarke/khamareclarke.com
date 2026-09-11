'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Full-screen presentation deck served at /presentation.
 *
 * Brand values are taken verbatim from the homepage:
 *   background   #111015  (bg-surface)
 *   cards        #181818  (bg-surface-muted)
 *   headings     #ffffff  (text-white)
 *   body copy    #ADB7BE  (text-muted)
 *   quiet text   text-white/{80,70,60,50,40,30}
 *   gold accent  .gold-text gradient clip; solid #ffb700 for small marks
 *   primary CTA  linear-gradient(135deg, #ff1e1e, #b30000)  (bg-crimson)
 *   CTA edge     #ff3b3b
 */

const SLIDES = [
  {
    id: 'title',
    kind: 'title',
    title: 'Khamare Clarke',
    lines: [
      'AI Scientist & MSc Candidate, Keele University',
      'AI Implementation Specialist',
    ],
  },
  {
    id: 'foundations',
    kicker: 'Foundations',
    title: "AI Isn't New",
    bullets: [
      'Theoretical roots: Alan Turing, 1950',
      'Decades in research labs',
      'Now: rapid SME adoption, measurable productivity gains',
    ],
  },
  {
    id: 'reframe',
    kicker: 'Reframe',
    title: "'AI Slop' Is Human Slop",
    bullets: [
      "No proper data audit has ever produced 'slop'",
      'Real pipelines = precise outputs',
      'The failure is lazy operators, not the tool',
    ],
  },
  {
    id: 'afraid-web',
    kicker: 'Fear-mongers 1',
    title: "Who's Actually Afraid — Web & Design",
    bullets: [
      "Drag-and-drop builders can't scale like AI-engineered platforms",
      "'SEO is dead' was never true — it evolved",
      'Template designers threatened by AI-assisted speed',
    ],
  },
  {
    id: 'afraid-agencies',
    kicker: 'Fear-mongers 2',
    title: "Who's Actually Afraid — Agencies & Security",
    bullets: [
      'Agencies reselling off-the-shelf tools as proprietary',
      'Security consultants selling fear to lock in retainers',
      'The bottleneck was always human incompetence',
    ],
  },
  {
    id: 'proof',
    kicker: 'Proof',
    title: 'MyApproved.com',
    placeholder: 'MyApproved.com screenshot',
    bullets: [
      'Verified tradesperson directory',
      'Direct competitor to Checkatrade',
      'Built solo, AI as the workforce',
    ],
  },
  {
    id: 'build',
    kicker: 'The build',
    title: 'The Digital Workforce',
    placeholder: 'Data lake diagram',
    bullets: [
      'Autonomous agents: marketing, copy, backend, data',
      'AI-flagged compliance: ICO, data protection, cyber insurance, solicitor contracts',
      'Launch It Labs → Staffordshire Chambers of Commerce',
    ],
  },
  {
    id: 'numbers',
    kind: 'statement',
    kicker: 'The numbers',
    title: '£30,000 This Month',
    bullets: [
      '5 months, solo founder, zero employees',
      'Human equivalent team: £150k–£200k/year payroll',
      "Leverage that wasn't possible before now",
    ],
  },
  {
    id: 'ahead',
    kicker: 'Where this goes',
    title: 'The Real Risks Ahead',
    bullets: [
      "Not hashtag anxiety over 'AI slop'",
      'Real threats: deepfakes, security gaps',
      'Human creativity, supercharged — not replaced',
    ],
  },
  {
    id: 'close',
    kind: 'cta',
    kicker: 'Close',
    title: 'Start Monday',
    bullets: [
      'Build a custom Gemini Gem for your business',
      'Not generic — built around your workflow',
      'Email me for the setup guide',
    ],
    contact: 'https://khamareclarke.com/#contact',
  },
];

function Placeholder({ label }) {
  return (
    <div className="flex h-full min-h-[9rem] w-full items-center justify-center rounded-xl border border-dashed border-[#ffb700]/30 bg-surface-muted">
      <span className="px-4 text-center text-[11px] uppercase tracking-[0.18em] text-white/40">
        {label}
      </span>
    </div>
  );
}

function GoldRule() {
  return (
    <span
      aria-hidden="true"
      className="h-[2px] w-10 shrink-0 bg-gradient-to-r from-transparent to-primary"
    />
  );
}

export default function PresentationPage() {
  const [index, setIndex] = useState(0);
  const total = SLIDES.length;
  const touchStart = useRef(null);

  const clamp = useCallback((n) => Math.max(0, Math.min(total - 1, n)), [total]);
  const next = useCallback(() => setIndex((i) => clamp(i + 1)), [clamp]);
  const prev = useCallback(() => setIndex((i) => clamp(i - 1)), [clamp]);

  // Keyboard navigation: arrows, space, page up/down, home/end.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        next();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        prev();
      } else if (e.key === 'Home') {
        e.preventDefault();
        setIndex(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        setIndex(total - 1);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, prev, total]);

  // Click/tap zones: left 30% steps back, the rest advances.
  const onZoneClick = (e) => {
    const { left, width } = e.currentTarget.getBoundingClientRect();
    if (e.clientX - left < width * 0.3) prev();
    else next();
  };

  const onTouchStart = (e) => {
    touchStart.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e) => {
    if (touchStart.current == null) return;
    const delta = e.changedTouches[0].clientX - touchStart.current;
    if (Math.abs(delta) > 45) (delta < 0 ? next : prev)();
    touchStart.current = null;
  };

  const slide = SLIDES[index];
  const isTitle = slide.kind === 'title';

  return (
    <div className="flex h-[100dvh] w-full flex-col overflow-hidden bg-surface text-white">
      {/* Progress rail */}
      <div className="flex items-center gap-4 px-6 pt-6 sm:px-10 sm:pt-8">
        <GoldRule />
        <span className="text-[11px] font-semibold uppercase leading-none tracking-[0.18em] gold-text whitespace-nowrap">
          {slide.kicker || 'Presentation'}
        </span>
        <GoldRule />
        <span className="ml-auto text-[11px] font-semibold tabular-nums tracking-[0.18em] text-white/40">
          {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </span>
      </div>
      <div className="mt-4 h-[2px] w-full bg-white/5">
        <div
          className="h-full bg-crimson transition-[width] duration-300 ease-out"
          style={{ width: `${((index + 1) / total) * 100}%` }}
        />
      </div>

      {/* Slide body — click a zone to navigate */}
      <div
        role="button"
        tabIndex={-1}
        aria-label="Slide navigation area — left third goes back, the rest advances"
        onClick={onZoneClick}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        className="flex flex-1 cursor-pointer select-none items-center overflow-hidden px-6 py-8 sm:px-10 sm:py-12 lg:px-16"
      >
        <div className="mx-auto flex w-full max-w-6xl flex-col">
          {isTitle ? (
            <>
              <h1 className="font-black leading-none tracking-tight text-white text-5xl sm:text-7xl lg:text-8xl">
                Khamare <span className="gold-text">Clarke</span>
              </h1>
              <div className="mt-8 space-y-2 border-l-2 border-[#ffb700]/40 pl-5">
                {slide.lines.map((line) => (
                  <p key={line} className="m-0 text-lg leading-snug text-muted sm:text-2xl">
                    {line}
                  </p>
                ))}
              </div>
            </>
          ) : (
            <>
              <h2
                className={`font-black leading-[1.05] tracking-tight text-white ${
                  slide.kind === 'statement'
                    ? 'text-5xl sm:text-7xl lg:text-8xl'
                    : 'text-4xl sm:text-5xl lg:text-6xl'
                }`}
              >
                {slide.title}
              </h2>

              <div
                className={`mt-10 grid gap-8 ${
                  slide.placeholder ? 'lg:grid-cols-12 lg:items-start' : ''
                }`}
              >
                <ul
                  className={`m-0 list-none space-y-4 p-0 ${
                    slide.placeholder ? 'lg:col-span-7' : ''
                  }`}
                >
                  {slide.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-4">
                      <span
                        aria-hidden="true"
                        className="mt-[0.6em] h-[6px] w-[6px] shrink-0 rounded-full bg-primary"
                      />
                      <span className="text-lg leading-snug text-muted sm:text-2xl lg:text-3xl">
                        {bullet}
                      </span>
                    </li>
                  ))}
                </ul>

                {slide.placeholder ? (
                  <div className="lg:col-span-5">
                    <Placeholder label={slide.placeholder} />
                  </div>
                ) : null}
              </div>

              {slide.contact ? (
                <div className="mt-12 flex flex-col gap-6 sm:flex-row sm:items-center">
                  <a
                    href={slide.contact}
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-[#ff3b3b] bg-crimson px-8 py-4 text-lg font-black text-white shadow-[0_0_30px_-4px_rgba(255,30,30,0.6)] transition-all duration-200 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff3b3b] focus-visible:ring-offset-2 focus-visible:ring-offset-surface sm:text-xl"
                  >
                    Email me for the setup guide
                  </a>
                  <div className="flex items-center gap-4">
                    <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-xl border border-dashed border-[#ffb700]/30 bg-surface-muted">
                      <span className="px-2 text-center text-[10px] uppercase leading-tight tracking-[0.14em] text-white/40">
                        QR code
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="m-0 text-[11px] uppercase tracking-[0.18em] text-white/40">
                        Scan or visit
                      </p>
                      <p className="m-0 truncate text-base text-white/80 sm:text-lg">
                        khamareclarke.com/#contact
                      </p>
                    </div>
                  </div>
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-4 border-t border-white/5 px-6 py-5 sm:px-10">
        <p className="m-0 hidden text-xs text-white/30 sm:block">
          Arrow keys, click, or swipe to navigate
        </p>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={prev}
            disabled={index === 0}
            aria-label="Previous slide"
            className="rounded-lg border border-white/20 px-5 py-2.5 text-sm font-bold text-white/80 transition-colors hover:border-[#ffb700]/60 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffb700] focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:pointer-events-none disabled:opacity-30"
          >
            ← Prev
          </button>
          <button
            type="button"
            onClick={next}
            disabled={index === total - 1}
            aria-label="Next slide"
            className="rounded-lg border-2 border-[#ff3b3b] bg-crimson px-5 py-2.5 text-sm font-bold text-white transition-all hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff3b3b] focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:pointer-events-none disabled:opacity-30"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
