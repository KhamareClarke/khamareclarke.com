#!/usr/bin/env node
/**
 * Capture a clean homepage screenshot of myapproved.com for the /presentation deck.
 *
 * Drives headless Chrome over the DevTools Protocol (no Puppeteer dependency) so we can
 * dismiss the cookie-consent banner before shooting — a plain `chrome --screenshot` run
 * always leaves the banner across the bottom of the frame.
 *
 * Usage: node scripts/capture-myapproved.mjs [url] [outFile]
 * Override the browser with CHROME_PATH if Chrome is not in the default location.
 */
import { spawn } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const TARGET_URL = process.argv[2] || 'https://myapproved.com';
const OUT_FILE =
  process.argv[3] || path.join(root, 'public', 'images', 'presentation', 'myapproved-homepage.png');

const CHROME =
  process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';

const VIEWPORT = { width: 1440, height: 900 };
const SCALE = 2; // retina — the deck renders this at up to ~700 CSS px wide
const PORT = 9333;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Poll the DevTools HTTP endpoint until Chrome is listening. */
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
  throw new Error(`Chrome did not expose DevTools on port ${PORT} within ${timeoutMs}ms`);
}

/** Minimal CDP client over the native WebSocket in Node 22+. */
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

/** Click the consent banner's accept button, if the site is showing one. */
const CLICK_ACCEPT = `(() => {
  const ACCEPT = /^(accept|accept all|agree|allow all|ok(ay)?|got it)$/i;
  const clicked = [];
  for (const el of document.querySelectorAll('button, a, [role="button"], input[type="button"]')) {
    const label = (el.innerText || el.value || el.getAttribute('aria-label') || '').trim();
    if (ACCEPT.test(label)) {
      el.click();
      clicked.push(label);
    }
  }
  return JSON.stringify(clicked);
})()`;

/**
 * Hide any leftover cookie overlay *without* detaching it. Removing a node React still
 * owns makes React throw on its next render, which replaces the page with the error
 * boundary — so we only ever toggle CSS here.
 */
const HIDE_LEFTOVER_BANNER = `(() => {
  const hidden = [];
  for (const el of document.querySelectorAll('div, section, aside')) {
    if (!/cookie/i.test(el.innerText || '')) continue;
    const pos = getComputedStyle(el).position;
    if (pos !== 'fixed' && pos !== 'sticky') continue;
    if (el.getBoundingClientRect().height < 30) continue;
    el.style.setProperty('display', 'none', 'important');
    hidden.push(el.className || el.id || el.tagName);
  }
  return JSON.stringify(hidden);
})()`;

/** True while the real homepage is still mounted (the error boundary has no <h1>). */
const PAGE_INTACT = `document.readyState === 'complete' && !!document.querySelector('h1')`;

async function main() {
  const userDataDir = mkdtempSync(path.join(tmpdir(), 'myapproved-shot-'));
  mkdirSync(path.dirname(OUT_FILE), { recursive: true });

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
      `--user-data-dir=${userDataDir}`,
      `--remote-debugging-port=${PORT}`,
      'about:blank',
    ],
    { stdio: 'ignore' }
  );

  let cdp;
  try {
    const version = await waitForChrome();
    console.log(`Chrome ${version.Browser} on port ${PORT}`);

    // Open a blank tab, then navigate exactly once. Creating the tab *with* the URL and
    // navigating again double-loads the page and trips the site's error boundary.
    const tabRes = await fetch(`http://127.0.0.1:${PORT}/json/new?about:blank`, { method: 'PUT' });
    const tab = await tabRes.json();

    cdp = await connect(tab.webSocketDebuggerUrl);
    await cdp.send('Page.enable');
    await cdp.send('Runtime.enable');
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: VIEWPORT.width,
      height: VIEWPORT.height,
      deviceScaleFactor: SCALE,
      mobile: false,
    });

    // Register the load listener before navigating so we can't miss the event.
    let loadResolve;
    const loaded = new Promise((r) => {
      loadResolve = r;
    });
    cdp.on((msg) => {
      if (msg.method === 'Page.loadEventFired') loadResolve();
    });

    const evaluate = async (expression) =>
      (await cdp.send('Runtime.evaluate', { expression, returnByValue: true })).result.value;

    // The site occasionally serves its error boundary to a cold headless client; one
    // reload clears it. Verify we actually landed on the homepage before shooting.
    for (let attempt = 1; attempt <= 3; attempt++) {
      await cdp.send('Page.navigate', { url: TARGET_URL });
      await Promise.race([loaded, sleep(30000)]);
      await sleep(2500); // fonts, hero imagery, animated underline

      if (await evaluate(PAGE_INTACT)) {
        console.log(`loaded "${await evaluate('document.title')}" (attempt ${attempt})`);
        break;
      }
      console.warn(`attempt ${attempt}: no <h1> / not complete — reloading`);
      if (attempt === 3) throw new Error(`could not load ${TARGET_URL} cleanly`);
    }

    console.log('consent clicked:', await evaluate(CLICK_ACCEPT));
    await sleep(900); // let the banner animate out

    if (await evaluate(PAGE_INTACT)) {
      console.log('leftover banner hidden:', await evaluate(HIDE_LEFTOVER_BANNER));
    } else {
      // Dismissing blew up the page — reload and just hide the banner instead.
      console.warn('page died after consent click; reloading and hiding the banner only');
      await cdp.send('Page.navigate', { url: TARGET_URL });
      await Promise.race([loaded, sleep(30000)]);
      await sleep(2500);
      console.log('leftover banner hidden:', await evaluate(HIDE_LEFTOVER_BANNER));
    }

    await sleep(600);

    if (!(await evaluate(PAGE_INTACT))) {
      throw new Error('page is showing its error boundary — refusing to save a bad screenshot');
    }

    const shot = await cdp.send('Page.captureScreenshot', {
      format: 'png',
      captureBeyondViewport: false,
    });
    writeFileSync(OUT_FILE, Buffer.from(shot.data, 'base64'));
    console.log(`captured -> ${path.relative(root, OUT_FILE)}`);
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
