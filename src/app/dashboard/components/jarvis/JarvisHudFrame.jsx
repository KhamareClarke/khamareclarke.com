'use client';

/** Corner brackets + scan grid — Iron Man cockpit frame. */
export default function JarvisHudFrame({ children }) {
  const corners = ['tl', 'tr', 'bl', 'br'];

  return (
    <div className="jarvis-hud-frame relative h-full w-full overflow-hidden">
      <div className="jarvis-hud-grid pointer-events-none absolute inset-0" aria-hidden />
      <div className="jarvis-hud-scanline pointer-events-none absolute inset-0" aria-hidden />

      {corners.map((c) => (
        <span key={c} className={`jarvis-hud-corner jarvis-hud-corner-${c}`} aria-hidden />
      ))}

      <div className="jarvis-hud-side jarvis-hud-side-left pointer-events-none" aria-hidden />
      <div className="jarvis-hud-side jarvis-hud-side-right pointer-events-none" aria-hidden />

      {children}
    </div>
  );
}
