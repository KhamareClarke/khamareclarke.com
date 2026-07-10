'use client';

/**
 * Lightweight double-clap detector via Web Audio API.
 * Two sharp transients within ~700ms triggers onDoubleClap.
 */
export async function createClapDetector({
  onDoubleClap,
  shouldListen = () => true,
  doubleClapWindowMs = 750,
  minClapGapMs = 100,
  cooldownMs = 1800,
} = {}) {
  if (typeof window === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
    return { stop: () => {}, setEnabled: () => {} };
  }

  let stream = null;
  let ctx = null;
  let analyser = null;
  let rafId = null;
  let enabled = true;
  let stopped = false;

  let clapCount = 0;
  let lastClapAt = 0;
  let lastPeakAt = 0;
  let lastActivateAt = 0;
  const energyHistory = [];

  try {
    stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
    });
    const Ctx = window.AudioContext || window.webkitAudioContext;
    ctx = new Ctx();
    if (ctx.state === 'suspended') await ctx.resume();

    const source = ctx.createMediaStreamSource(stream);
    const highpass = ctx.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.value = 1800;

    analyser = ctx.createAnalyser();
    analyser.fftSize = 1024;
    analyser.smoothingTimeConstant = 0.15;

    source.connect(highpass);
    highpass.connect(analyser);

    const timeData = new Uint8Array(analyser.fftSize);

    const loop = () => {
      if (stopped) return;
      rafId = requestAnimationFrame(loop);
      if (!enabled || !shouldListen()) return;

      analyser.getByteTimeDomainData(timeData);
      let sum = 0;
      for (let i = 0; i < timeData.length; i += 1) {
        const v = (timeData[i] - 128) / 128;
        sum += v * v;
      }
      const rms = Math.sqrt(sum / timeData.length);

      energyHistory.push(rms);
      if (energyHistory.length > 24) energyHistory.shift();
      const baseline =
        energyHistory.reduce((a, b) => a + b, 0) / Math.max(energyHistory.length, 1) || 0.008;

      const now = performance.now();
      const spike = rms > Math.max(baseline * 4.2, 0.12) && rms > baseline + 0.06;

      if (spike && now - lastPeakAt > minClapGapMs) {
        lastPeakAt = now;
        if (now - lastClapAt <= doubleClapWindowMs) {
          clapCount += 1;
        } else {
          clapCount = 1;
        }
        lastClapAt = now;

        if (clapCount >= 2 && now - lastActivateAt >= cooldownMs) {
          clapCount = 0;
          lastActivateAt = now;
          onDoubleClap?.();
        }
      }
    };

    rafId = requestAnimationFrame(loop);
  } catch {
    return { stop: () => {}, setEnabled: () => {} };
  }

  return {
    stop() {
      stopped = true;
      if (rafId) cancelAnimationFrame(rafId);
      stream?.getTracks?.().forEach((t) => t.stop());
      stream = null;
      ctx?.close?.().catch(() => {});
      ctx = null;
    },
    setEnabled(value) {
      enabled = Boolean(value);
      if (!enabled) clapCount = 0;
    },
  };
}
