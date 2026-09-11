'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { QrPanel, SlideVisual, TitleBackdrop } from './visuals';

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
 *
 * Layout rule: every slide is centred horizontally, and a slide carrying both a visual
 * and text stacks them — visual on top, text underneath. Nothing is set side-by-side.
 *
 * Speaker notes live in the NOTES map below and are surfaced by the bottom-right toggle
 * so the deck can be driven from a phone in hand while the projector shows the slide.
 *
 * Supporting visuals live in ./visuals.js — including the MyApproved.com homepage
 * screenshot (public/images/presentation/myapproved-homepage.png), regenerated with
 * `node scripts/capture-myapproved.mjs`.
 */

/* Speaker script — verbatim, one entry per slide (4–5 and 6–8 share a script). */
const NOTES = {
  title:
    "My name is Khamare Clarke. I'm an AI scientist and Master's student in Computer Science with Artificial Intelligence at Keele University. Today I want to cut through some of the panic around this technology, and show you what actually happens when AI gets used properly in a small business — not the theory, the real thing.",
  foundations:
    "AI's not new, by the way. People think it dropped out of nowhere last year — it didn't. Alan Turing laid the groundwork back in 1950. It just sat in research labs for decades. What's changed is speed — small businesses using this properly are seeing real productivity gains right now. It's not a toy anymore, it's becoming a survival tool.",
  reframe:
    "Now — there's a phrase going around, 'AI slop.' I want to push back on that a bit. Honestly? I'd call it human slop. Nobody who's actually pulled real data into a data lake, broken it down into data bricks, and properly audited the output has ever looked at that and gone 'this is slop.' It doesn't happen — when it's done right, it's precise. What people are actually pointing at is lazy shortcuts — someone bashing out a generic LinkedIn post, generating a throwaway image. That's not AI failing. That's someone not putting the work in and blaming the tool.",
  fearmongers:
    "And here's the thing — that reality tells you exactly who's nervous right now, and why. Website builders running the old drag-and-drop model are worried, because they can't compete with something engineered properly. They're also the ones who spent years telling you 'SEO is dead' — it's not, it just changed shape. Marketing agencies reselling the same off-the-shelf tools as their own secret sauce — not thrilled either. Security consultants who scare business owners to lock them into retainers — using AI to audit your own code isn't scary, it's just useful. None of this was ever really about the technology. It's about people whose whole model depended on you not being able to do this yourself.",
  proof:
    "So let me show you what that actually looks like. I built MyApproved.com — a verified tradesperson directory, goes head-to-head with Checkatrade. I built it with AI doing a lot of the heavy lifting — marketing, copy, backend, the data side, all of it, pulling straight into a data lake and breaking it down into data bricks for analysis. It also caught things I'd have missed — flagged that I needed ICO registration, proper data protection, cyber insurance, contracts signed off by a solicitor. From there I took it into rooms like this one — pitched at Launch It Labs five months ago, got a membership with the Staffordshire Chambers of Commerce, brought in real solicitors and security people to actually lock it all in. To hire a team to do what I've got running — copywriters, data people, marketing, backend — you're looking at £150,000 to £200,000 a year. I've done it solo. No employees. And this month, five months in, I've scaled it to £30,000.",
  tower:
    "This is what that actually looks like under the hood — not one AI, a whole stack of them, like a full team. Master orchestrator at the top, running everything. Underneath, departments — marketing, compliance, data and reporting, customer response, admin and ops — each one doing an actual job, same as an employee would. Nobody on payroll. And here's the thing — you can build the exact same structure for your own business, in your own Gemini.",
  ahead:
    "I'm not going to stand here and tell you it's all doom. The future of this is genuinely good — it frees people up to actually be creative instead of buried in admin. The real risks worth worrying about aren't hashtags about 'AI slop' — they're things like deepfakes, real security gaps. That's where the attention should be going.",
  takeaway:
    "So here's what I'd actually do if I were you, starting Monday. Open up Google Gemini. Build yourself a custom Gem — not a generic one, something built around how your business actually runs, with a master orchestrator on top and departments underneath it, same as what I just showed you. That's your first AI hire, basically. If you want a head start, email me and I'll send you exactly how to set one up.",
};

const SLIDES = [
  {
    id: 'title',
    kind: 'title',
    title: 'Khamare Clarke',
    lines: [
      'AI Scientist & MSc Candidate, Keele University',
      'AI Implementation Specialist',
    ],
    notes: NOTES.title,
  },
  {
    id: 'foundations',
    kicker: 'Foundations',
    title: "AI Isn't New",
    visual: { kind: 'timeline' },
    bullets: [
      'Theoretical roots: Alan Turing, 1950',
      'Decades in research labs',
      'Now: rapid SME adoption, measurable productivity gains',
    ],
    notes: NOTES.foundations,
  },
  {
    id: 'reframe',
    kicker: 'Reframe',
    title: "'AI Slop' Is Human Slop",
    visual: {
      kind: 'icon',
      icon: 'filter',
      eyebrow: 'Data audit',
      caption: 'Every output passes the pipeline before it reaches a customer.',
    },
    bullets: [
      "No proper data audit has ever produced 'slop'",
      'Real pipelines = precise outputs',
      'The failure is lazy operators, not the tool',
    ],
    notes: NOTES.reframe,
  },
  {
    id: 'afraid',
    kicker: 'Fear-mongers',
    title: "Who's Actually Afraid",
    visual: {
      kind: 'icon',
      icon: 'shield',
      eyebrow: 'The common thread',
      caption: 'Every one of these models depends on you not being able to do it yourself.',
    },
    bullets: [
      "Drag-and-drop web builders can't compete — and 'SEO is dead' was never true",
      'Agencies reselling off-the-shelf tools as their own secret sauce',
      'Security consultants selling fear to lock in retainers',
      'The bottleneck was always human incompetence',
    ],
    notes: NOTES.fearmongers,
  },
  {
    id: 'proof',
    kicker: 'Proof',
    title: 'MyApproved.com',
    visual: { kind: 'screenshot' },
    bullets: [
      'Verified tradesperson directory',
      'Direct competitor to Checkatrade',
      'Built solo, AI as the workforce',
    ],
    notes: NOTES.proof,
  },
  {
    id: 'build',
    kicker: 'The build',
    title: 'The Digital Workforce',
    visual: { kind: 'dataflow' },
    bullets: [
      'Autonomous agents: marketing, copy, backend, data',
      'AI-flagged compliance: ICO, data protection, cyber insurance, solicitor contracts',
      'Launch It Labs → Staffordshire Chambers of Commerce',
    ],
    notes: NOTES.proof,
  },
  {
    id: 'numbers',
    kind: 'statement',
    kicker: 'The numbers',
    title: '£30,000 This Month',
    visual: { kind: 'bars' },
    bullets: [
      '5 months, solo founder, zero employees',
      'Human equivalent team: £150k–£200k/year payroll',
      "Leverage that wasn't possible before now",
    ],
    notes: NOTES.proof,
  },
  {
    id: 'tower',
    kicker: 'Under the hood',
    title: 'The AI Department',
    visual: { kind: 'tower' },
    subline:
      'Every one of these can be built as a custom Gem in your own Gemini — same structure, your business.',
    notes: NOTES.tower,
  },
  {
    id: 'ahead',
    kicker: 'Where this goes',
    title: 'The Real Risks Ahead',
    visual: {
      kind: 'icon',
      icon: 'face',
      eyebrow: 'Real risk',
      caption: 'Deepfakes and security gaps — not hashtag anxiety.',
    },
    bullets: [
      "Not hashtag anxiety over 'AI slop'",
      'Real threats: deepfakes, security gaps',
      'Human creativity, supercharged — not replaced',
    ],
    notes: NOTES.ahead,
  },
  {
    id: 'takeaway',
    kind: 'takeaway',
    kicker: 'Takeaway',
    title: 'Start Monday',
    visual: { kind: 'checklist' },
    contact: 'https://khamareclarke.com/#contact',
    notes: NOTES.takeaway,
  },
];

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
  const [notesOpen, setNotesOpen] = useState(false);
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
      } else if (e.key === 'n' || e.key === 'N') {
        setNotesOpen((open) => !open);
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
      {/* Progress rail — centred, including the slide counter */}
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 px-6 pt-6 sm:px-10 sm:pt-8">
        <GoldRule />
        <span className="text-[11px] font-semibold uppercase leading-none tracking-[0.18em] gold-text whitespace-nowrap">
          {slide.kicker || 'Presentation'}
        </span>
        <GoldRule />
        <span className="text-[11px] font-semibold tabular-nums leading-none tracking-[0.18em] text-white/40">
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
        className="relative flex flex-1 cursor-pointer select-none overflow-y-auto overflow-x-hidden px-6 py-8 sm:px-10 sm:py-12 lg:px-16"
      >
        {isTitle ? <TitleBackdrop /> : null}

        {/* `my-auto` rather than `items-center` on the scroller: it centres when the slide
            fits, and when it doesn't the overflow stays reachable above the fold. */}
        <div className="relative mx-auto my-auto flex w-full max-w-5xl flex-col items-center text-center">
          {isTitle ? (
            <>
              <h1 className="text-center font-black leading-none tracking-tight text-white text-5xl sm:text-7xl lg:text-8xl">
                Khamare <span className="gold-text">Clarke</span>
              </h1>
              <div className="mt-8 flex flex-col items-center gap-2">
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
                className={`text-center font-black leading-[1.05] tracking-tight text-white ${
                  slide.kind === 'statement'
                    ? 'text-4xl sm:text-7xl lg:text-8xl'
                    : 'text-4xl sm:text-5xl lg:text-6xl'
                }`}
              >
                {slide.title}
              </h2>

              {slide.visual ? (
                <div className="mt-6 w-full sm:mt-8">
                  <SlideVisual visual={slide.visual} />
                </div>
              ) : null}

              {slide.bullets?.length ? (
                <ul className="m-0 mt-6 flex list-none flex-col items-center gap-2.5 p-0 sm:mt-8 sm:gap-3">
                  {slide.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="text-center text-base leading-snug text-muted sm:text-lg lg:text-2xl"
                    >
                      {bullet}
                    </li>
                  ))}
                </ul>
              ) : null}

              {slide.subline ? (
                <p className="mx-auto m-0 mt-6 max-w-3xl text-center text-base leading-snug text-muted sm:text-lg">
                  {slide.subline}
                </p>
              ) : null}

              {slide.contact ? (
                <div className="mt-6 flex flex-col items-center gap-4">
                  <a
                    href={slide.contact}
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-[#ff3b3b] bg-crimson px-8 py-4 text-lg font-black text-white shadow-[0_0_30px_-4px_rgba(255,30,30,0.6)] transition-all duration-200 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff3b3b] focus-visible:ring-offset-2 focus-visible:ring-offset-surface sm:text-xl"
                  >
                    Email me for the setup guide
                  </a>
                  <QrPanel url={slide.contact} />
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>

      {/* Controls — centred; extra bottom room on phones keeps the notes toggle clear */}
      <div className="flex flex-col items-center gap-3 border-t border-white/5 px-6 pb-24 pt-5 sm:px-10 sm:pb-5">
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
        <p className="m-0 hidden text-xs text-white/30 sm:block">
          Arrow keys, click, or swipe to navigate · press N for notes
        </p>
      </div>

      {/* Speaker notes panel — a bottom sheet on phones, a side card on desktop */}
      {notesOpen ? (
        <aside
          id="speaker-notes"
          aria-label="Speaker notes"
          className="fixed inset-x-0 bottom-0 z-40 max-h-[62dvh] overflow-y-auto border-t-2 border-primary/60 bg-[#0c0b10]/95 px-6 pb-28 pt-5 shadow-[0_-24px_70px_-24px_rgba(0,0,0,0.95)] backdrop-blur sm:inset-x-auto sm:bottom-24 sm:right-5 sm:max-h-[68dvh] sm:w-[27rem] sm:rounded-lg sm:border-2 sm:px-5 sm:pb-5"
        >
          <p className="m-0 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
            Speaker notes · {slide.kicker || 'Opening'}
          </p>
          <p className="m-0 mt-3 text-base leading-relaxed text-white/90">{slide.notes}</p>
        </aside>
      ) : null}

      {/* Thumb-reachable toggle, pinned to the bottom-right corner */}
      <button
        type="button"
        onClick={() => setNotesOpen((open) => !open)}
        aria-label="Toggle speaker notes"
        aria-expanded={notesOpen}
        aria-controls="speaker-notes"
        className={`fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-lg border-2 px-5 py-3.5 text-sm font-black shadow-[0_0_30px_-6px_rgba(255,183,0,0.8)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffb700] focus-visible:ring-offset-2 focus-visible:ring-offset-surface ${
          notesOpen
            ? 'border-[#ff3b3b] bg-crimson text-white'
            : 'border-[#ffb700] bg-[#0c0b10]/95 text-white hover:bg-[#ffb700] hover:text-[#111015]'
        }`}
      >
        <span aria-hidden="true" className="text-base leading-none">
          {notesOpen ? '▾' : '▴'}
        </span>
        Notes
      </button>
    </div>
  );
}
