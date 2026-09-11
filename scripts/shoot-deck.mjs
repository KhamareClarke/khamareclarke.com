#!/usr/bin/env node
/**
 * Screenshot every /presentation slide in real headless Chrome, for design review.
 *
 * Usage: node scripts/shoot-deck.mjs [baseUrl] [outDir]
 * Override the browser with CHROME_PATH if Chrome is not in the default location.
 */
import { spawn } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const BASE = process.argv[2] || 'http://localhost:3000';
const OUT_DIR = process.argv[3] || path.join(root, '.deck-shots');
const CHROME =
  process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PORT = 9334;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function waitForChrome(timeoutMs = 20000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json/version`);
      if (res.ok) return await res.json();
    } catch {
      /* not up yet */
    }
    await sleep(250);
  }
  throw new Error(`Chrome did not expose DevTools on port ${PORT}`);
}

function connect(wsUrl) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(wsUrl);
    let id = 0;
    const pending = new Map();
    const listeners = new Set();

    ws.addEventListener('open', () =>
      resolve({
        send(method, params = {}) {
          const msgId = ++id;
          ws.send(JSON.stringify({ id: msgId, method, params }));
          return new Promise((res, rej) => pending.set(msgId, { res, rej }));
        },
        on(fn) {
          listeners.add(fn);
        },
        close: () => ws.close(),
      })
    );
    ws.addEventListener('error', (e) => reject(new Error(`WebSocket error: ${e.message || e}`)));
    ws.addEventListener('message', (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && pending.has(msg.id)) {
        const { res, rej } = pending.get(msg.id);
        pending.delete(msg.id);
        if (msg.error) rej(new Error(`${msg.error.message} (${JSON.stringify(msg.error.data ?? '')})`));
        else res(msg.result);
      } else if (msg.method) {
        for (const fn of listeners) fn(msg);
      }
    });
  });
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });
  const userDataDir = mkdtempSync(path.join(tmpdir(), 'deck-shots-'));

  const chrome = spawn(
    CHROME,
    [
      '--headless=new',
      '--disable-gpu',
      '--no-sandbox',
      '--no-first-run',
      '--no-default-browser-check',
      '--hide-scrollbars',
      '--disable-extensions',
      '--force-device-scale-factor=1',
      `--user-data-dir=${userDataDir}`,
      `--remote-debugging-port=${PORT}`,
      'about:blank',
    ],
    { stdio: 'ignore' }
  );

  let cdp;
  try {
    const version = await waitForChrome();
    console.log(`Chrome ${version.Browser}`);

    const tabRes = await fetch(`http://127.0.0.1:${PORT}/json/new?about:blank`, { method: 'PUT' });
    const tab = await tabRes.json();
    cdp = await connect(tab.webSocketDebuggerUrl);
    await cdp.send('Page.enable');
    await cdp.send('Runtime.enable');

    const evaluate = async (expression) =>
      (await cdp.send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true }))
        .result.value;

    const shoot = async (name) => {
      const shot = await cdp.send('Page.captureScreenshot', { format: 'png' });
      const file = path.join(OUT_DIR, `${name}.png`);
      writeFileSync(file, Buffer.from(shot.data, 'base64'));
      console.log(`  -> ${path.basename(file)}`);
    };

    const setViewport = (width, height, mobile) =>
      cdp.send('Emulation.setDeviceMetricsOverride', {
        width,
        height,
        deviceScaleFactor: 1,
        mobile,
      });

    const goToSlide = async (i) => {
      await evaluate(`document.querySelectorAll('button[aria-label="Next slide"]')[0].click()`);
      await sleep(120);
      // step back to the first slide, then forward i times
      for (let n = 0; n < 12; n++) {
        await evaluate(`(() => {
          const b = document.querySelector('button[aria-label="Previous slide"]');
          if (b && !b.disabled) b.click();
        })()`);
      }
      await sleep(150);
      for (let n = 0; n < i; n++) {
        await evaluate(`document.querySelector('button[aria-label="Next slide"]').click()`);
        await sleep(90);
      }
      await sleep(450);
    };

    const notesOpen = async (open) => {
      await evaluate(`(() => {
        const has = !!document.querySelector('#speaker-notes');
        if (${open} !== has) document.querySelector('button[aria-label="Toggle speaker notes"]').click();
      })()`);
      for (let n = 0; n < 20; n++) {
        const has = await evaluate(`!!document.querySelector('#speaker-notes')`);
        if (has === open) return has;
        await sleep(50);
      }
      return !open;
    };

    const slideHeading = () =>
      evaluate(`(document.querySelector('h1') || document.querySelector('h2') || {}).textContent || ''`);

    /** Does the slide's own scroller overflow? Any overflow means content is cut off. */
    const overflow = () =>
      evaluate(`(() => {
        const sc = document.querySelector('[aria-label^="Slide navigation area"]');
        if (!sc) return null;
        return { over: sc.scrollHeight - sc.clientHeight, scrollH: sc.scrollHeight, clientH: sc.clientHeight };
      })()`);

    const reportOverflow = async (label) => {
      const m = await overflow();
      const flag = m && m.over > 1 ? `OVERFLOW +${m.over}px` : 'fits';
      console.log(`    ${label}: ${flag} (${m?.scrollH}/${m?.clientH})`);
    };

    /* ── Desktop pass ────────────────────────────────────────────────────── */
    await setViewport(1440, 900, false);
    await cdp.send('Page.navigate', { url: `${BASE}/presentation` });
    await sleep(4000);

    // Preloader must not be covering the deck.
    const preloader = await evaluate(
      `!!document.querySelector('[role="status"][aria-label="Loading"]')`
    );
    console.log(`preloader present on /presentation: ${preloader}  (expected false)`);

    const total = await evaluate(
      `Number((document.body.innerText.match(/(\\d\\d)\\s*\\/\\s*(\\d\\d)/) || [])[2] || 0)`
    );
    console.log(`slides in deck: ${total}`);

    /**
     * Prove the notes toggle is actually on screen and hittable — "it's in the DOM" is not
     * the same as "a person can see and tap it". Hit-testing the centre point catches the
     * case where something else is painted on top of it.
     */
    const toggleProbe = () =>
      evaluate(`(() => {
        const b = document.querySelector('button[aria-label="Toggle speaker notes"]');
        if (!b) return { found: false };
        const r = b.getBoundingClientRect();
        const cs = getComputedStyle(b);
        const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
        return {
          found: true,
          label: b.innerText.trim(),
          box: [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)],
          viewport: [innerWidth, innerHeight],
          onScreen: r.top >= 0 && r.left >= 0 && r.bottom <= innerHeight && r.right <= innerWidth,
          styles: cs.display + '/' + cs.visibility + '/op' + cs.opacity + '/z' + cs.zIndex,
          hitTest: hit === b || b.contains(hit) ? 'TOGGLE' : (hit ? hit.tagName + ' (covered)' : 'none'),
        };
      })()`);

    console.log('notes toggle (desktop):', JSON.stringify(await toggleProbe()));

    for (let i = 0; i < total; i++) {
      await goToSlide(i);
      const head = (await slideHeading()).trim().replace(/\s+/g, ' ');
      console.log(`slide ${i + 1}: "${head}"`);
      await reportOverflow('desktop');
      await shoot(`desktop-${String(i + 1).padStart(2, '0')}`);
    }

    // Every slide must carry its own script in the notes panel.
    console.log('\n--- speaker notes per slide ---');
    for (let i = 0; i < total; i++) {
      await goToSlide(i);
      await notesOpen(true);
      const note = await evaluate(
        `(document.querySelector('#speaker-notes p:last-of-type') || {}).textContent || ''`
      );
      const head = note.trim().replace(/\s+/g, ' ').slice(0, 64);
      console.log(`  ${String(i + 1).padStart(2, '0')}: ${note.length} chars — "${head}…"`);
      await notesOpen(false);
    }

    // Notes panel open, on a content-heavy slide.
    await goToSlide(2);
    console.log(`\nnotes open: ${await notesOpen(true)}`);
    await sleep(400);
    await shoot('desktop-notes-open');
    await notesOpen(false);

    /* ── Phone pass ──────────────────────────────────────────────────────── */
    await setViewport(390, 844, true);
    await cdp.send('Page.navigate', { url: `${BASE}/presentation` });
    await sleep(3500);
    console.log('notes toggle (phone):  ', JSON.stringify(await toggleProbe()));
    for (let i = 0; i < total; i++) {
      await goToSlide(i);
      await reportOverflow(`phone slide ${i + 1}`);
    }
    await goToSlide(0);
    await shoot('phone-01-title');

    const towerIdx = total - 3; // tower sits two slides before the close
    const closeIdx = total - 1;
    await goToSlide(towerIdx);
    console.log(`phone tower: "${(await slideHeading()).trim()}"`);
    await shoot(`phone-${String(towerIdx + 1).padStart(2, '0')}-tower`);

    await goToSlide(closeIdx);
    await shoot(`phone-${String(closeIdx + 1).padStart(2, '0')}-takeaway`);

    console.log(`notes open (phone): ${await notesOpen(true)}`);
    await sleep(400);
    await shoot(`phone-${String(closeIdx + 1).padStart(2, '0')}-notes-open`);

    /* ── Homepage still shows the preloader ──────────────────────────────── */
    await setViewport(1440, 900, false);
    await cdp.send('Page.navigate', { url: `${BASE}/` });
    await sleep(800);
    const homePreloader = await evaluate(
      `!!document.querySelector('[role="status"][aria-label="Loading"]')`
    );
    console.log(`preloader present on /: ${homePreloader}  (expected true)`);
  } finally {
    try {
      cdp?.close();
    } catch {
      /* already gone */
    }
    chrome.kill();
    await sleep(400);
    rmSync(userDataDir, { recursive: true, force: true });
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
