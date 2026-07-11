'use client';

/** Concentric HUD rings — Iron Man JARVIS style. */
export default function JarvisHudRings({ active, listening = false, className = '' }) {
  return (
    <svg
      className={`jarvis-hud-rings pointer-events-none ${listening ? 'jarvis-hud-rings--listening' : ''} ${className}`}
      viewBox="0 0 400 400"
      aria-hidden
    >      <defs>
        <radialGradient id="jarvisHudGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(255,183,0,0.25)" />
          <stop offset="70%" stopColor="rgba(255,140,0,0.06)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <filter id="jarvisHudBlur">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <circle cx="200" cy="200" r="198" fill="url(#jarvisHudGlow)" />

      {/* Outer segmented ring */}
      <g className={active ? 'jarvis-hud-spin-slow' : ''} style={{ transformOrigin: '200px 200px' }}>
        {Array.from({ length: 60 }).map((_, i) => {
          const a = (i / 60) * Math.PI * 2;
          const r1 = 185;
          const r2 = i % 5 === 0 ? 175 : 180;
          return (
            <line
              key={`t-${i}`}
              x1={200 + Math.cos(a) * r1}
              y1={200 + Math.sin(a) * r1}
              x2={200 + Math.cos(a) * r2}
              y2={200 + Math.sin(a) * r2}
              stroke="rgba(255,183,0,0.35)"
              strokeWidth={i % 5 === 0 ? 0.9 : 0.5}
            />
          );
        })}
      </g>

      {/* Dashed rings */}
      <circle
        cx="200"
        cy="200"
        r="160"
        fill="none"
        stroke="rgba(255,183,0,0.18)"
        strokeWidth="0.7"
        strokeDasharray="8 12"
        className={active ? 'jarvis-hud-spin-reverse' : ''}
        style={{ transformOrigin: '200px 200px' }}
      />
      <circle
        cx="200"
        cy="200"
        r="130"
        fill="none"
        stroke="rgba(255,140,0,0.28)"
        strokeWidth="0.8"
        strokeDasharray="2 6"
        className={active ? 'jarvis-hud-spin-mid' : ''}
        style={{ transformOrigin: '200px 200px' }}
      />
      <circle
        cx="200"
        cy="200"
        r="100"
        fill="none"
        stroke="rgba(255,202,40,0.38)"
        strokeWidth="1"
        className={active ? 'jarvis-hud-pulse-ring' : ''}
      />

    </svg>
  );
}
