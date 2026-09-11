'use client';

import {
  ArrowUpRight,
  Filter,
  LayoutTemplate,
  ScanFace,
  ShieldAlert,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

/**
 * Supporting visuals for the /presentation deck.
 *
 * Brand values, as used across the deck (see page.js header):
 *   background #111015 · cards #181818 · body copy #ADB7BE · gold #ffb700 · crimson #ff1e1e
 *
 * Layout rule for every panel here: content is centred horizontally, and where a slide
 * carries both an image and text the two stack vertically (visual on top, text below).
 * Nothing in the deck is left-aligned or set side-by-side — see page.js for the framing.
 *
 * Sizing rule: tall visuals are capped in `vh` so a slide always fits the viewport without
 * scrolling — the deck has to hold together on a 900px-tall laptop as well as a projector.
 *
 * Design rules these follow (ANTI-AI-DESIGN.md): brand tokens only, icons used bare
 * rather than dropped into a coloured circle, step numbers set in normal text rather
 * than as ghost numerals, and one card radius (rounded-lg).
 */

const MYAPPROVED_URL = 'https://myapproved.com';
const SCREENSHOT_SRC = '/images/presentation/myapproved-homepage.png';

/* ── Slide 1 — subtle backdrop so the title slide isn't bare type ─────────── */

export function TitleBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
          maskImage: 'radial-gradient(ellipse at 50% 42%, #000 0%, transparent 78%)',
          WebkitMaskImage: 'radial-gradient(ellipse at 50% 42%, #000 0%, transparent 78%)',
        }}
      />
      <div
        className="absolute -right-40 -top-40 h-[620px] w-[620px]"
        style={{
          background:
            'radial-gradient(circle, rgba(255,183,0,0.17) 0%, rgba(255,183,0,0.05) 42%, rgba(255,183,0,0) 70%)',
        }}
      />
      <div
        className="absolute -bottom-40 -left-28 h-[520px] w-[520px]"
        style={{
          background:
            'radial-gradient(circle, rgba(255,30,30,0.13) 0%, rgba(255,30,30,0) 68%)',
        }}
      />
    </div>
  );
}

/* ── Slide 2 — where the field came from ─────────────────────────────────── */

const ERAS = [
  { year: '1950', label: "Turing's paper opens the field" },
  { year: '1956 – 2010s', label: 'Decades locked in research labs' },
  { year: 'Now', label: 'SME adoption with measurable output' },
];

export function EraTimeline() {
  return (
    <div className="mx-auto w-full max-w-md rounded-lg border border-white/10 bg-surface-muted p-5 text-center">
      <p className="m-0 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">
        The long road here
      </p>
      <ol className="m-0 mt-5 flex list-none flex-col items-center gap-4 p-0">
        {ERAS.map((era) => (
          <li key={era.year} className="flex flex-col items-center">
            <span aria-hidden="true" className="h-[7px] w-[7px] rounded-full bg-primary" />
            <span className="mt-2 block text-sm font-bold tabular-nums text-white">{era.year}</span>
            <span className="mt-0.5 block text-sm leading-snug text-muted">{era.label}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ── Slides 3, 4, 5, 10 — one bare icon carrying the slide's point ────────── */

const ICONS = {
  filter: Filter,
  layout: LayoutTemplate,
  shield: ShieldAlert,
  face: ScanFace,
};

export function IconPanel({ icon, eyebrow, caption }) {
  const Icon = ICONS[icon];
  if (!Icon) return null;
  return (
    <div className="mx-auto w-full max-w-md rounded-lg border border-white/10 bg-surface-muted p-5 text-center">
      <Icon aria-hidden="true" strokeWidth={1.25} className="mx-auto h-9 w-9 text-primary" />
      <span
        aria-hidden="true"
        className="mx-auto mt-4 block h-[2px] w-9 bg-gradient-to-r from-transparent via-primary to-transparent"
      />
      <p className="m-0 mt-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">
        {eyebrow}
      </p>
      <p className="m-0 mt-1.5 text-sm leading-snug text-muted sm:text-base">{caption}</p>
    </div>
  );
}

/* ── Slide 6 — the real thing, and it links out ──────────────────────────── */

export function ProofScreenshot() {
  return (
    <a
      href={MYAPPROVED_URL}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      aria-label="Open MyApproved.com in a new tab"
      className="group mx-auto block w-fit max-w-full rounded-lg border border-white/10 bg-surface-muted p-2 transition-colors hover:border-[#ffb700]/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffb700] focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={SCREENSHOT_SRC}
        alt="MyApproved.com homepage — “Hire a tradesperson you actually count on”"
        width={2880}
        height={1800}
        className="mx-auto block h-auto max-h-[28vh] w-auto max-w-full rounded-md"
      />
      <span className="flex flex-col items-center gap-1 px-2 pb-1 pt-3 text-center">
        <span className="text-[11px] uppercase tracking-[0.18em] text-white/40">Live site</span>
        <span className="inline-flex items-center gap-1 text-sm font-bold text-primary">
          myapproved.com
          <ArrowUpRight aria-hidden="true" className="h-4 w-4" strokeWidth={2.25} />
        </span>
      </span>
    </a>
  );
}

/* ── Slide 7 — raw data to clean output ──────────────────────────────────── */

const FLOW_STAGES = [
  { label: 'Raw data', note: 'Scrapes, listings, forms', tone: 'quiet' },
  { label: 'Data lake', note: 'One source of truth', tone: 'gold' },
  { label: 'Processing', note: 'Agents clean and verify', tone: 'gold' },
  { label: 'Clean output', note: 'Approved and publishable', tone: 'crimson' },
];

const TONES = {
  quiet: { stroke: 'rgba(255,255,255,0.12)' },
  gold: { stroke: 'rgba(255,183,0,0.45)' },
  crimson: { stroke: 'rgba(255,30,30,0.5)' },
};

const NODE_H = 66;
const STEP = NODE_H + 38;

export function DataFlowDiagram() {
  const height = FLOW_STAGES.length * STEP - 38;

  return (
    // Height-capped box: the SVG letterboxes inside it via preserveAspectRatio, so the
    // diagram shrinks on a short laptop screen instead of pushing the slide into overflow.
    <div className="mx-auto h-[26vh] max-h-[360px] w-full max-w-sm sm:h-[34vh]">
      <svg
        viewBox={`0 0 320 ${height}`}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="Raw data flows into a data lake, through agent processing, and out as clean approved output."
        className="h-full w-full"
      >
        {FLOW_STAGES.map((stage, i) => {
          const y = i * STEP;
          const tone = TONES[stage.tone];
          const isLast = i === FLOW_STAGES.length - 1;

          return (
            <g key={stage.label}>
              <rect
                x="1"
                y={y}
                width="318"
                height={NODE_H}
                rx="12"
                fill="#181818"
                stroke={tone.stroke}
                strokeWidth="1"
              />
              <text
                x="160"
                y={y + 30}
                textAnchor="middle"
                fill="#ffffff"
                fontSize="15"
                fontWeight="700"
              >
                {stage.label}
              </text>
              <text x="160" y={y + 49} textAnchor="middle" fill="#ADB7BE" fontSize="11">
                {stage.note}
              </text>

              {!isLast ? (
                <>
                  <path
                    d={`M160 ${y + NODE_H + 7} L160 ${y + STEP - 15}`}
                    stroke="rgba(255,183,0,0.3)"
                    strokeWidth="1.5"
                    strokeDasharray="3 4"
                  />
                  <path
                    d={`M155.5 ${y + STEP - 20} L160 ${y + STEP - 12} L164.5 ${y + STEP - 20}`}
                    fill="none"
                    stroke="#ffb700"
                    strokeWidth="1.5"
                  />
                </>
              ) : null}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* ── Slide 8 — what the same output costs the conventional way ───────────── */

const PAYROLL = [
  {
    label: 'Solo founder + AI stack',
    value: 'Zero employees',
    valueClass: 'text-primary',
    bar: 'bg-gold',
    width: '14%',
  },
  {
    label: 'Human-equivalent team',
    value: '£150k–£200k / yr',
    valueClass: 'text-white/60',
    bar: 'bg-white/25',
    width: '100%',
  },
];

export function LeverageBars() {
  return (
    <div className="mx-auto w-full max-w-lg rounded-lg border border-white/10 bg-surface-muted p-5 text-center">
      <p className="m-0 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">
        Same output, different payroll
      </p>

      {PAYROLL.map((row) => (
        <div key={row.label} className="mt-5 flex flex-col items-center">
          <span className="text-sm font-bold text-white">{row.label}</span>
          <span className={`mt-0.5 text-sm font-bold tabular-nums ${row.valueClass}`}>
            {row.value}
          </span>
          <div className="mt-2.5 h-2 w-full rounded-full bg-white/5">
            <div className={`h-full rounded-full ${row.bar}`} style={{ width: row.width }} />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Slide 9 — the stack of agents, drawn as a tower ─────────────────────── */

const DEPARTMENTS = [
  {
    role: 'Marketing Agent',
    does: 'Writes copy, manages campaigns, monitors performance',
    edge: 'rgba(255,183,0,0.55)',
    bg: 'rgba(255,183,0,0.10)',
  },
  {
    role: 'Compliance Agent',
    does: 'Flags legal gaps, tracks regulatory requirements',
    edge: 'rgba(255,30,30,0.55)',
    bg: 'rgba(255,30,30,0.10)',
  },
  {
    role: 'Data & Reporting Agent',
    does: 'Analyzes performance, builds reports',
    edge: 'rgba(255,183,0,0.55)',
    bg: 'rgba(255,183,0,0.10)',
  },
  {
    role: 'Customer Response Agent',
    does: 'Handles enquiries, drafts replies',
    edge: 'rgba(255,30,30,0.55)',
    bg: 'rgba(255,30,30,0.10)',
  },
  {
    role: 'Admin & Ops Agent',
    does: 'Manages workflows, scheduling, documentation',
    edge: 'rgba(255,183,0,0.55)',
    bg: 'rgba(255,183,0,0.10)',
  },
];

export function DepartmentTower() {
  return (
    <div className="mx-auto flex w-full max-w-[24rem] flex-col items-stretch">
      {/* Roof cap */}
      <div className="mx-auto h-[5px] w-1/2 rounded-t bg-gold" />
      <div className="mx-auto h-[3px] w-[62%] bg-primary/25" />

      {/* Top floor — the orchestrator that dispatches to every department below */}
      <div className="mt-1.5 rounded-lg border-2 border-primary bg-primary/10 px-4 py-2.5 text-center shadow-[0_0_40px_-12px_rgba(255,183,0,0.9)]">
        <p className="m-0 text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">
          Top floor
        </p>
        <p className="m-0 mt-0.5 text-base font-black leading-tight text-white sm:text-lg">
          Master Orchestrator
        </p>
      </div>

      {/* Department floors — one staff card per agent */}
      <div className="mt-1.5 flex flex-col gap-[3px] rounded-lg border border-white/10 bg-black/40 p-[3px]">
        {DEPARTMENTS.map((dept) => (
          <div
            key={dept.role}
            className="rounded-[5px] px-3 py-1.5 text-center"
            style={{ border: `1px solid ${dept.edge}`, background: dept.bg }}
          >
            <span className="block text-sm font-bold leading-tight text-white sm:text-base">
              {dept.role}
            </span>
            <span className="mt-0.5 block text-[11px] leading-tight text-muted sm:text-xs">
              {dept.does}
            </span>
          </div>
        ))}
      </div>

      {/* Ground plate */}
      <div
        className="mt-1.5 h-[5px] rounded-b"
        style={{ background: 'linear-gradient(90deg, #ffb700 0%, #ff1e1e 50%, #ffb700 100%)' }}
      />
    </div>
  );
}

/* ── Slide 11 — the closing checklist, large and centred ─────────────────── */

const TAKEAWAY_STEPS = [
  'Open Google Gemini.',
  'Build a custom Gem for your business — orchestrator on top, departments underneath.',
  'Email me for the setup guide.',
];

export function TakeawayChecklist() {
  return (
    <ol className="mx-auto m-0 flex w-full max-w-2xl list-none flex-col items-center gap-4 p-0 text-center sm:gap-5">
      {TAKEAWAY_STEPS.map((step, i) => (
        <li key={step} className="flex flex-col items-center gap-1">
          <span className="text-xs font-black tabular-nums tracking-[0.2em] text-primary">
            {String(i + 1).padStart(2, '0')}
          </span>
          <span className="text-lg font-bold leading-snug text-white sm:text-xl lg:text-2xl">
            {step}
          </span>
        </li>
      ))}
    </ol>
  );
}

/* ── Closing slide — a QR code that actually resolves ────────────────────── */

export function QrPanel({ url }) {
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <span className="shrink-0 rounded-lg bg-white p-2">
        <QRCodeSVG
          value={url}
          size={72}
          level="M"
          marginSize={1}
          bgColor="#ffffff"
          fgColor="#111015"
          title={`QR code linking to ${url}`}
        />
      </span>
      <p className="m-0 text-[11px] uppercase tracking-[0.18em] text-white/40">
        Scan or visit khamareclarke.com/#contact
      </p>
    </div>
  );
}

/* ── Dispatch ────────────────────────────────────────────────────────────── */

export function SlideVisual({ visual }) {
  if (!visual) return null;

  switch (visual.kind) {
    case 'timeline':
      return <EraTimeline />;
    case 'icon':
      return <IconPanel icon={visual.icon} eyebrow={visual.eyebrow} caption={visual.caption} />;
    case 'screenshot':
      return <ProofScreenshot />;
    case 'dataflow':
      return <DataFlowDiagram />;
    case 'bars':
      return <LeverageBars />;
    case 'tower':
      return <DepartmentTower />;
    case 'checklist':
      return <TakeawayChecklist />;
    default:
      return null;
  }
}
