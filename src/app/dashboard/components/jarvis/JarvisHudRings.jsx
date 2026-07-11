'use client';

/** Concentric HUD rings — refined precision instrument aesthetic. */
export default function JarvisHudRings({ active, listening = false, className = '' }) {
  const compassAngles = [0, Math.PI / 2, Math.PI, Math.PI * 1.5];

  return (
    <svg
      className={`jarvis-hud-rings pointer-events-none ${listening ? 'jarvis-hud-rings--listening' : ''} ${className}`}
      viewBox="0 0 400 400"
      aria-hidden
    >
      <defs>
        <radialGradient id="jarvisHudGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="rgba(255,183,0,0.12)" />
          <stop offset="65%"  stopColor="rgba(255,140,0,0.03)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>

      {/* Very faint ambient fill */}
      <circle cx="200" cy="200" r="198" fill="url(#jarvisHudGlow)" />

      {/* Outermost fine halo ring */}
      <circle cx="200" cy="200" r="193" fill="none" stroke="rgba(255,183,0,0.06)" strokeWidth="0.4" />

      {/* Compass-point precision markers — longer ticks at cardinal directions */}
      {compassAngles.map((a, i) => (
        <line
          key={`cp-${i}`}
          x1={200 + Math.cos(a) * 197}
          y1={200 + Math.sin(a) * 197}
          x2={200 + Math.cos(a) * 186}
          y2={200 + Math.sin(a) * 186}
          stroke="rgba(255,183,0,0.42)"
          strokeWidth="0.75"
        />
      ))}

      {/* Fine tick ring — 72 ticks, instrument-grade weight */}
      <g className={active ? 'jarvis-hud-spin-slow' : ''}>
        {Array.from({ length: 72 }).map((_, i) => {
          const a = (i / 72) * Math.PI * 2;
          const isMajor = i % 9 === 0;
          const isMinor = i % 3 === 0;
          const r1 = 183;
          const r2 = isMajor ? 174 : isMinor ? 179 : 181;
          const opacity = isMajor ? 0.30 : isMinor ? 0.14 : 0.07;
          return (
            <line
              key={`t-${i}`}
              x1={200 + Math.cos(a) * r1}
              y1={200 + Math.sin(a) * r1}
              x2={200 + Math.cos(a) * r2}
              y2={200 + Math.sin(a) * r2}
              stroke={`rgba(255,183,0,${opacity})`}
              strokeWidth={isMajor ? 0.7 : 0.38}
            />
          );
        })}
      </g>

      {/* Ring 1 — slow reverse spin, hairline */}
      <circle
        cx="200" cy="200" r="168"
        fill="none"
        stroke="rgba(255,183,0,0.10)"
        strokeWidth="0.5"
        className={active ? 'jarvis-hud-spin-reverse' : ''}
      />

      {/* Ring 2 — mid spin, long dash */}
      <circle
        cx="200" cy="200" r="152"
        fill="none"
        stroke="rgba(255,140,0,0.13)"
        strokeWidth="0.55"
        strokeDasharray="14 20"
        className={active ? 'jarvis-hud-spin-mid' : ''}
      />

      {/* Ring 3 — slow, short dots */}
      <circle
        cx="200" cy="200" r="134"
        fill="none"
        stroke="rgba(255,183,0,0.09)"
        strokeWidth="0.45"
        strokeDasharray="3 9"
        className={active ? 'jarvis-hud-spin-slow' : ''}
      />

      {/* Ring 4 — pulse ring, thin */}
      <circle
        cx="200" cy="200" r="112"
        fill="none"
        stroke="rgba(255,202,40,0.16)"
        strokeWidth="0.65"
        className={active ? 'jarvis-hud-pulse-ring' : ''}
      />

      {/* Inner boundary ring */}
      <circle cx="200" cy="200" r="90" fill="none" stroke="rgba(255,183,0,0.06)" strokeWidth="0.35" />
    </svg>
  );
}
