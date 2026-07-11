/**
 * Task 1 verify — static HUD previews for before/after screenshots (no auth required).
 * Run: node docs/verify/task1/capture-screenshots.mjs
 */
import { execSync } from 'node:child_process';
import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dir = dirname(fileURLToPath(import.meta.url));
const root = join(__dir, '../../..');

function gitShow(ref, path) {
  return execSync(`git show ${ref}:${path}`, { cwd: root, encoding: 'utf8' });
}

function extractJarvisCss(css) {
  const start = css.indexOf('/* JARVIS — blue holographic');
  const end = css.indexOf('/* START: Cookie Banner Fix */');
  if (start === -1) return css;
  return css.slice(start, end > start ? end : undefined);
}

function coreHtml(state = 'idle', size = 'lg') {
  const lg = size === 'lg';
  const stageClass = lg ? 'w-56 h-56 md:w-72 md:h-72' : 'w-36 h-36';
  const orbClass = lg ? 'w-36 h-36 md:w-44 md:h-44' : 'w-20 h-20';
  return `
<div class="jarvis-voice-core flex flex-col items-center py-0">
  <div class="jarvis-voice-core-stage relative flex items-center justify-center ${stageClass}">
    <span class="jarvis-arc-reactor-glow jarvis-reactor-idle absolute rounded-full inset-2"></span>
    <span class="jarvis-core-ring absolute inset-[18%] rounded-full z-[5]"></span>
    <div class="jarvis-core-orb jarvis-core-idle relative z-10 rounded-full overflow-hidden ${orbClass}">
      <div class="jarvis-core-inner absolute inset-0 rounded-full"></div>
      <div class="jarvis-core-shine absolute inset-0 rounded-full"></div>
      <div class="jarvis-core-dots absolute inset-0 flex items-center justify-center gap-2 z-20">
        ${Array.from({ length: 5 }).map(() => '<span class="jarvis-core-dot"></span>').join('')}
      </div>
    </div>
  </div>
  <p class="jarvis-core-title mt-5 font-bold tracking-[0.28em] uppercase text-base md:text-lg">J.A.R.V.I.S</p>
  <div class="jarvis-listen-pill mt-3"><span class="jarvis-listen-pill-dot"></span><span>Standing by</span></div>
</div>`;
}

function hudShell(core, label) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>JARVIS ${label} — Task 1 Verify</title>
<link rel="stylesheet" href="/design-tokens.css" />
<style>
@import url('/globals.css');
body {
  margin: 0;
  min-height: 100vh;
  background: #020617;
  font-family: system-ui, sans-serif;
}
.verify-wrap {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.verify-label {
  text-align: center;
  padding: 12px;
  color: #7dd3fc;
  font-size: 12px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  border-bottom: 1px solid rgba(56,189,248,0.15);
}
.verify-core {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}
.verify-hud {
  width: min(1200px, 100%);
  min-height: 640px;
  border: 1px solid rgba(56,189,248,0.15);
  border-radius: 12px;
  overflow: hidden;
  display: grid;
  grid-template-rows: auto 1fr;
  background: #020617;
}
.jarvis-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
  border-bottom: 1px solid rgba(56,189,248,0.1);
}
.jarvis-topbar-brand { font-weight: 700; letter-spacing: 0.22em; color: #e0f2fe; }
.jarvis-hud-body {
  display: grid;
  grid-template-columns: 220px 1fr 280px;
  gap: 16px;
  padding: 16px;
  align-items: center;
}
.jarvis-widget-card {
  border-radius: 12px;
  border: 1px solid rgba(56,189,248,0.18);
  background: linear-gradient(165deg, rgba(15,29,50,0.72), rgba(3,7,18,0.85));
  padding: 14px;
}
.jarvis-center-stage {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  min-height: 420px;
}
.jarvis-hud-rings-stage {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 420px;
  height: 420px;
  opacity: 0.85;
}
</style>
</head>
<body>
<div class="verify-wrap">
  <p class="verify-label">${label}</p>
  <div class="verify-hud jarvis-ref-ui jarvis-cockpit">
    <header class="jarvis-topbar">
      <span class="jarvis-topbar-brand">J.A.R.V.I.S</span>
      <span style="color:rgba(74,222,128,0.85);font-size:10px;letter-spacing:0.2em">ONLINE</span>
    </header>
    <div class="jarvis-hud-body">
      <aside class="jarvis-widget-card">
        <p class="jarvis-widget-title">System Stats</p>
        <p class="jarvis-stat-label">Leads today</p>
        <p class="jarvis-stat-value">3</p>
      </aside>
      <div class="jarvis-center-stage">
        <svg class="jarvis-hud-rings-stage" viewBox="0 0 400 400" aria-hidden>
          <circle cx="200" cy="200" r="160" fill="none" stroke="rgba(34,211,238,0.25)" stroke-width="1" stroke-dasharray="8 12"/>
          <circle cx="200" cy="200" r="130" fill="none" stroke="rgba(56,189,248,0.4)" stroke-width="1.5"/>
          <circle cx="200" cy="200" r="100" fill="none" stroke="rgba(125,211,252,0.55)" stroke-width="2"/>
        </svg>
        ${core}
      </div>
      <aside class="jarvis-widget-card">
        <p class="jarvis-widget-title">Conversation</p>
        <p style="color:rgba(125,211,252,0.85);font-size:13px;line-height:1.6">Hello, I am JARVIS. How can I assist you today, sir?</p>
      </aside>
    </div>
  </div>
</div>
</body>
</html>`;
}

mkdirSync(__dir, { recursive: true });

const tag = 'checkpoint/task1-sophistication-before';
const beforeCss = extractJarvisCss(gitShow(tag, 'src/app/globals.css'));
const afterCss = extractJarvisCss(gitShow('HEAD', 'src/app/globals.css'));

// Write scoped preview pages with inlined JARVIS CSS only
function writePreview(name, css, coreSizes) {
  const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"/><title>${name}</title>
<style>${css}
body{margin:0;background:#020617;color:#e0f2fe;font-family:system-ui,sans-serif}
.verify-label{text-align:center;padding:12px;font-size:12px;letter-spacing:.2em;text-transform:uppercase;color:#7dd3fc;border-bottom:1px solid rgba(56,189,248,.15)}
.verify-hud{max-width:1100px;margin:24px auto;border:1px solid rgba(56,189,248,.15);border-radius:12px;overflow:hidden;background:#020617}
.jarvis-hud-body{display:grid;grid-template-columns:200px 1fr 260px;gap:16px;padding:16px;align-items:center;min-height:520px}
.jarvis-center-stage{display:flex;align-items:center;justify-content:center;position:relative;min-height:400px}
.jarvis-hud-rings-stage{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:400px;height:400px;opacity:.85}
</style></head><body>
<p class="verify-label">${name}</p>
<div class="verify-hud jarvis-ref-ui jarvis-cockpit">
<header class="jarvis-topbar" style="display:flex;justify-content:space-between;padding:12px 20px;border-bottom:1px solid rgba(56,189,248,.1)">
<span class="jarvis-topbar-brand">J.A.R.V.I.S</span><span style="font-size:10px;letter-spacing:.2em;color:rgba(74,222,128,.85)">ONLINE</span></header>
<div class="jarvis-hud-body">
<aside class="jarvis-widget-card"><p class="jarvis-widget-title">System Stats</p><div class="jarvis-hud-stat"><p class="jarvis-stat-label">Leads today</p><p class="jarvis-stat-value">3</p></div></aside>
<div class="jarvis-center-stage">
<svg class="jarvis-hud-rings-stage jarvis-hud-rings" viewBox="0 0 400 400"><circle cx="200" cy="200" r="160" fill="none" stroke="rgba(34,211,238,0.25)" stroke-width="1" stroke-dasharray="8 12"/><circle cx="200" cy="200" r="100" fill="none" stroke="rgba(125,211,252,0.55)" stroke-width="2"/></svg>
${coreSizes}
</div>
<aside class="jarvis-widget-card"><p class="jarvis-widget-title">Conversation</p><p style="font-size:13px;opacity:.85;line-height:1.6">Hello, I am JARVIS.</p></aside>
</div></div></body></html>`;
  writeFileSync(join(__dir, `${name}.html`), html);
}

const beforeCore = gitShow(tag, 'src/app/dashboard/components/jarvis/JarvisVoiceCore.jsx');
const isBeforeBulky = beforeCore.includes('w-40 h-40');

writePreview(
  'before-core-and-hud',
  beforeCss,
  `<div class="jarvis-voice-core flex flex-col items-center py-0">
  <div class="jarvis-voice-core-stage relative flex items-center justify-center w-56 h-56 md:w-72 md:h-72">
    <span class="jarvis-arc-reactor-glow jarvis-reactor-idle absolute rounded-full inset-2"></span>
    <div class="jarvis-core-orb jarvis-core-idle relative z-10 rounded-full overflow-hidden w-36 h-36 md:w-44 md:h-44">
      <div class="jarvis-core-inner absolute inset-0 rounded-full"></div>
      <div class="jarvis-core-shine absolute inset-0 rounded-full"></div>
      <div class="jarvis-core-dots absolute inset-0 flex items-center justify-center gap-2 z-20">
        ${'<span class="jarvis-core-dot"></span>'.repeat(5)}
      </div>
    </div>
  </div>
  <p class="jarvis-core-title mt-5 font-bold tracking-[0.28em] uppercase text-base md:text-lg">J.A.R.V.I.S</p>
  <div class="jarvis-listen-pill mt-3"><span class="jarvis-listen-pill-dot"></span><span>Standing by</span></div>
</div>`
);

writePreview(
  'after-core-and-hud',
  afterCss,
  `<div class="jarvis-voice-core flex w-full flex-col items-center text-center py-0">
  <div class="jarvis-voice-core-stage relative mx-auto flex items-center justify-center w-48 h-48 sm:w-52 sm:h-52 md:w-56 md:h-56">
    <span class="jarvis-arc-reactor-glow jarvis-reactor-idle absolute rounded-full inset-3"></span>
    <span class="jarvis-core-ring absolute inset-[18%] rounded-full z-[5]"></span>
    <div class="jarvis-core-orb jarvis-core-idle relative z-10 rounded-full overflow-hidden w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32">
      <div class="jarvis-core-inner absolute inset-0 rounded-full"></div>
      <div class="jarvis-core-shine absolute inset-0 rounded-full"></div>
      <div class="jarvis-core-dots absolute inset-0 flex items-center justify-center gap-1.5 z-20">
        ${'<span class="jarvis-core-dot"></span>'.repeat(5)}
      </div>
    </div>
  </div>
  <p class="jarvis-core-title mt-4 w-full text-center font-bold tracking-[0.24em] uppercase text-sm md:text-base">J.A.R.V.I.S</p>
  <div class="jarvis-listen-pill mt-2.5 mx-auto"><span class="jarvis-listen-pill-dot"></span><span>Standing by</span></div>
</div>`
);

console.log('Wrote before-core-and-hud.html and after-core-and-hud.html');
console.log('Before bulky core:', isBeforeBulky);
