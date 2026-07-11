'use client';

import { useEffect, useState } from 'react';

/** Bottom audio spectrum bars — animates when listening or speaking. */
export default function JarvisHudVisualizer({ active, barCount = 48 }) {
  const [heights, setHeights] = useState(() => Array(barCount).fill(0.15));

  useEffect(() => {
    if (!active) {
      setHeights(Array(barCount).fill(0.12));
      return undefined;
    }
    const id = setInterval(() => {
      setHeights(
        Array.from({ length: barCount }, (_, i) => {
          const wave = Math.sin(Date.now() / 120 + i * 0.35) * 0.5 + 0.5;
          const noise = Math.random() * 0.4;
          return Math.min(1, 0.2 + wave * 0.6 + noise);
        })
      );
    }, 80);
    return () => clearInterval(id);
  }, [active, barCount]);

  return (
    <div className="jarvis-hud-visualizer flex items-end justify-center gap-[3px] h-16 w-full max-w-3xl mx-auto px-4" aria-hidden>
      {heights.map((h, i) => (
        <span
          key={i}
          className="jarvis-hud-bar flex-1 max-w-[6px] rounded-t-sm bg-gradient-to-t from-sky-600 to-cyan-300"
          style={{
            height: `${Math.max(8, h * 64)}px`,
            opacity: active ? 0.5 + h * 0.5 : 0.25,
            boxShadow: active ? `0 0 ${6 + h * 8}px rgba(34,211,238,${0.3 + h * 0.4})` : 'none',
          }}
        />
      ))}
    </div>
  );
}
