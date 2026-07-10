'use client';

/** Floating ambient bubbles behind the JARVIS panel. */
export default function JarvisAmbient() {
  const bubbles = [
    { w: 120, h: 120, top: '8%', left: '5%', delay: 0 },
    { w: 80, h: 80, top: '35%', left: '75%', delay: 2 },
    { w: 160, h: 160, top: '60%', left: '10%', delay: 4 },
    { w: 60, h: 60, top: '75%', left: '65%', delay: 1 },
    { w: 100, h: 100, top: '15%', left: '55%', delay: 3 },
    { w: 50, h: 50, top: '50%', left: '40%', delay: 5 },
  ];

  return (
    <div className="jarvis-ambient pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {bubbles.map((b, i) => (
        <span
          key={i}
          className="jarvis-bubble absolute rounded-full"
          style={{
            width: b.w,
            height: b.h,
            top: b.top,
            left: b.left,
            animationDelay: `${b.delay}s`,
          }}
        />
      ))}
      <div className="jarvis-ambient-glow absolute inset-0" />
    </div>
  );
}
