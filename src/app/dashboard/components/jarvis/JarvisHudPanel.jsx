'use client';

/** Tactical side readout panel — glass HUD module. */
export default function JarvisHudPanel({ title, children, align = 'left', variant = 'default', className = '' }) {
  const widthClass =
    variant === 'comms'
      ? 'md:w-[19rem] lg:w-[26rem] xl:w-[30rem]'
      : 'md:w-44 lg:w-48 xl:w-52';

  const alignClass =
    variant === 'comms'
      ? 'items-stretch text-left jarvis-hud-panel-comms'
      : align === 'right'
        ? 'items-end text-right'
        : 'items-start text-left';

  return (
    <aside
      className={`jarvis-hud-panel jarvis-hud-module hidden md:flex flex-col gap-3 h-full min-h-0 shrink-0 ${widthClass} ${alignClass} ${className}`}
    >
      <div className="jarvis-hud-module-header w-full flex items-center gap-2 shrink-0">
        <span className="jarvis-hud-module-dot" aria-hidden />
        <p className="jarvis-hud-panel-title flex-1 text-[10px] tracking-[0.35em] uppercase text-cyan-400/80">
          {title}
        </p>
      </div>
      <div
        className={`jarvis-hud-panel-body w-full min-h-0 text-[11px] text-sky-300/85 font-mono ${
          variant === 'comms' ? 'flex flex-1 flex-col overflow-hidden' : 'space-y-2.5 overflow-y-auto'
        }`}
      >
        {children}
      </div>
    </aside>
  );
}
