'use client';

/** Ambient background — subtle floating bubbles + slow-moving mesh gradient. */
export default function JarvisAmbient() {
  const bubbles = [
    { w: 100, h: 100, top: '8%',  left: '5%',  delay: 0 },
    { w: 65,  h: 65,  top: '35%', left: '76%', delay: 2 },
    { w: 130, h: 130, top: '62%', left: '10%', delay: 4 },
    { w: 50,  h: 50,  top: '76%', left: '66%', delay: 1 },
    { w: 85,  h: 85,  top: '14%', left: '56%', delay: 3 },
    { w: 42,  h: 42,  top: '50%', left: '41%', delay: 5 },
  ];

  return (
    <div className="jarvis-ambient pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {/* Slow-moving mesh gradient depth — mirrors homepage gradient-blob pattern */}
      <div className="jarvis-mesh-blob jarvis-mesh-blob-a" />
      <div className="jarvis-mesh-blob jarvis-mesh-blob-b" />

      {/* Fine floating bubbles — reduced opacity vs before */}
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
            opacity: 0.55,
          }}
        />
      ))}
      <div className="jarvis-ambient-glow absolute inset-0" />
    </div>
  );
}
