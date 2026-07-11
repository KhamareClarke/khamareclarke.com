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
          <stop offset="0%" stopColor="rgba(56,189,248,0.18)" />
          <stop offset="70%" stopColor="rgba(14,165,233,0.05)" />
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
              stroke="rgba(56,189,248,0.32)"
              strokeWidth={i % 5 === 0 ? 1.2 : 0.65}
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
        stroke="rgba(34,211,238,0.25)"
        strokeWidth="1"
        strokeDasharray="8 12"
        className={active ? 'jarvis-hud-spin-reverse' : ''}
        style={{ transformOrigin: '200px 200px' }}
      />
      <circle
        cx="200"
        cy="200"
        r="130"
        fill="none"
        stroke="rgba(56,189,248,0.4)"
        strokeWidth="1.5"
        strokeDasharray="2 6"
        className={active ? 'jarvis-hud-spin-mid' : ''}
        style={{ transformOrigin: '200px 200px' }}
      />
      <circle
        cx="200"
        cy="200"
        r="100"
        fill="none"
        stroke="rgba(125,211,252,0.55)"
        strokeWidth="2"
        className={active ? 'jarvis-hud-pulse-ring' : ''}
      />

      {/* Cross hairs */}
      <line x1="200" y1="40" x2="200" y2="90" stroke="rgba(56,189,248,0.3)" strokeWidth="1" />
      <line x1="200" y1="310" x2="200" y2="360" stroke="rgba(56,189,248,0.3)" strokeWidth="1" />
      <line x1="40" y1="200" x2="90" y2="200" stroke="rgba(56,189,248,0.3)" strokeWidth="1" />
      <line x1="310" y1="200" x2="360" y2="200" stroke="rgba(56,189,248,0.3)" strokeWidth="1" />
    </svg>
  );
}
