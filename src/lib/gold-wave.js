/**
 * The gold wave's motion, as numbers, so more than one medium can share it.
 *
 * The canvas below rasterises this onto the lion. The gold TEXT cannot take a canvas
 * (it is clipped with background-clip: text), so it reproduces the same motion as a
 * gradient instead — but it must be the SAME motion, so both read the shift from here
 * rather than each carrying their own copy of the sine.
 *
 * `t` is a requestAnimationFrame timestamp. Every rAF callback in a document shares one
 * time origin, so the preloader's canvas and the page's gradients are on the same clock
 * by construction — they cannot drift apart.
 */

/** Angular rate of the swing, per millisecond. Period is 2*PI/0.0011, about 5.7s. */
const GOLD_RATE = 0.0011;

/** 0..1, the same value the canvas uses to place its gradient endpoints. */
export function goldShift(t) {
  return (Math.sin(t * GOLD_RATE) + 1) / 2;
}

/**
 * The canvas gradient runs from (0, 0.15+0.5s) to (1, 0.85-0.5s), so its direction is
 * (1, 0.7-s) in screen coordinates where y points down. CSS measures a gradient's angle
 * clockwise from "to top", which is atan2(dx, -dy) — hence the sign flip. The result
 * swings between roughly 125deg (steep, down-right) and 73deg (up-right), which is the
 * inversion you see rippling through the mark.
 */
export function goldAngleDeg(t) {
  const dy = 0.7 - goldShift(t);
  return (Math.atan2(1, -dy) * 180) / Math.PI;
}

/**
 * The gold chroma wave — one renderer, two homes.
 *
 * The preloader draws flowing chroma waves and masks them to the lion's silhouette so
 * the light ripples *through* the mark. Master Clarke wants the brand mark in the
 * header and footer to animate IDENTICALLY, which a CSS gradient sweep can never do:
 * the preloader is canvas sine waves at a drifting angle, not a gradient travelling
 * across a box. So rather than write the maths twice and let the two drift apart, the
 * preloader and the on-page marks both call this.
 *
 * If you change the wave here, both change together. That is the point.
 *
 * Call it with a canvas that is already laid out at `size` css pixels. It returns a
 * dispose function; call it on unmount or the rAF loop outlives the element.
 */
export function createGoldWave(canvas, { maskSrc = '/images/logo.webp', size = 200 } = {}) {
  if (!canvas) return () => {};
  const ctx = canvas.getContext('2d');
  if (!ctx) return () => {};

  const dpr = Math.min((typeof window !== 'undefined' && window.devicePixelRatio) || 1, 2);
  canvas.width = size * dpr;
  canvas.height = size * dpr;
  ctx.scale(dpr, dpr);

  // Offscreen buffer: waves are drawn here, then masked by the lion's alpha.
  const buf = document.createElement('canvas');
  buf.width = size * dpr;
  buf.height = size * dpr;
  const bctx = buf.getContext('2d');
  bctx.scale(dpr, dpr);

  const maskImg = new Image();
  maskImg.src = maskSrc;

  let raf = 0;
  let disposed = false;

  const drawWaves = (t) => {
    bctx.clearRect(0, 0, size, size);

    // Chroma gradient: deep amber -> warm white -> deep amber, drifting with time.
    const shift = (Math.sin(t * 0.0011) + 1) / 2; // 0..1
    const g = bctx.createLinearGradient(0, size * (0.15 + shift * 0.5), size, size * (0.85 - shift * 0.5));
    g.addColorStop(0.0, 'rgba(255,140,0,0.0)');
    g.addColorStop(0.28, 'rgba(255,183,0,0.85)');
    g.addColorStop(0.5, 'rgba(255,248,225,1)');
    g.addColorStop(0.72, 'rgba(255,183,0,0.85)');
    g.addColorStop(1.0, 'rgba(255,140,0,0.0)');

    const bands = 5;
    for (let i = 0; i < bands; i++) {
      const amp = 3.5 + i * 2.4;
      const freq = 0.03 - i * 0.0035;
      const speed = 0.0022 + i * 0.0004;
      const yBase = size * (0.3 + i * 0.11);

      bctx.beginPath();
      for (let x = -4; x <= size + 4; x += 2) {
        const y =
          yBase +
          Math.sin(x * freq + t * speed + i * 1.7) * amp +
          Math.sin(x * freq * 0.43 - t * speed * 0.6 + i) * (amp * 0.45);
        if (x <= -4) bctx.moveTo(x, y);
        else bctx.lineTo(x, y);
      }
      bctx.lineWidth = 1.6 + i * 0.5;
      bctx.strokeStyle = g;
      bctx.lineCap = 'round';
      bctx.stroke();
    }

    // A soft chroma bloom travelling with the waves.
    const cx = size * (0.5 + Math.sin(t * 0.0016) * 0.28);
    const cy = size * (0.5 + Math.cos(t * 0.0013) * 0.22);
    const bloom = bctx.createRadialGradient(cx, cy, 0, cx, cy, size * 0.42);
    bloom.addColorStop(0, 'rgba(255,236,179,0.55)');
    bloom.addColorStop(1, 'rgba(255,183,0,0)');
    bctx.fillStyle = bloom;
    bctx.fillRect(0, 0, size, size);

    // Mask the whole wave layer to the lion silhouette.
    if (maskImg.complete && maskImg.naturalWidth) {
      bctx.globalCompositeOperation = 'destination-in';
      bctx.drawImage(maskImg, 0, 0, size, size);
      bctx.globalCompositeOperation = 'source-over';
    } else {
      bctx.clearRect(0, 0, size, size); // wait for the mask rather than show a rectangle
    }
  };

  const loop = (t) => {
    if (disposed) return;
    drawWaves(t);
    ctx.clearRect(0, 0, size, size);
    ctx.drawImage(buf, 0, 0, size, size);
    raf = requestAnimationFrame(loop);
  };

  const start = () => {
    if (!disposed) raf = requestAnimationFrame(loop);
  };
  if (maskImg.complete) start();
  else maskImg.onload = start;

  return () => {
    disposed = true;
    cancelAnimationFrame(raf);
  };
}
