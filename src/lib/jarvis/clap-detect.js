'use client';

/**
 * Double-clap detector via Web Audio API.
 * Two sharp transients within the window wakes Jarvis.
 *
 * Tuned for built-in laptop mics (AGC/noise often flatten claps).
 */
export async function createClapDetector({
  onDoubleClap,
  onTripleClap,
  shouldListen = () => true,
  doubleClapWindowMs = 1200,
  minClapGapMs = 60,
  cooldownMs = 1600,
} = {}) {
  if (typeof window === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
    return { stop: () => {}, setEnabled: () => {}, ready: false };
  }

  const onWake = onDoubleClap || onTripleClap;

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
  const rmsHistory = [];
  const peakHistory = [];

  const resumeCtx = async () => {
    if (ctx && ctx.state === 'suspended') {
      try {
        await ctx.resume();
      } catch {
        // ignore
      }
    }
  };

  try {
    /* Keep processing light so clap spikes survive (NS/EC often flatten them). */
    stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false,
        channelCount: 1,
      },
    });
    const Ctx = window.AudioContext || window.webkitAudioContext;
    ctx = new Ctx();
    await resumeCtx();

    const source = ctx.createMediaStreamSource(stream);
    /* Claps are broadband; too-high a cutoff kills laptop-mic energy. */
    const highpass = ctx.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.value = 600;
    highpass.Q.value = 0.7;

    analyser = ctx.createAnalyser();
    analyser.fftSize = 512;
    analyser.smoothingTimeConstant = 0;

    source.connect(highpass);
    highpass.connect(analyser);

    const timeData = new Uint8Array(analyser.fftSize);

    const onVis = () => {
      if (document.visibilityState === 'visible') void resumeCtx();
    };
    document.addEventListener('visibilitychange', onVis);

    const loop = () => {
      if (stopped) return;
      rafId = requestAnimationFrame(loop);
      if (!enabled || !shouldListen()) return;
      if (ctx?.state === 'suspended') {
        void resumeCtx();
        return;
      }

      analyser.getByteTimeDomainData(timeData);
      let sum = 0;
      let peak = 0;
      for (let i = 0; i < timeData.length; i += 1) {
        const v = (timeData[i] - 128) / 128;
        const a = Math.abs(v);
        if (a > peak) peak = a;
        sum += v * v;
      }
      const rms = Math.sqrt(sum / timeData.length);

      rmsHistory.push(rms);
      peakHistory.push(peak);
      if (rmsHistory.length > 30) rmsHistory.shift();
      if (peakHistory.length > 30) peakHistory.shift();

      const baselineRms =
        rmsHistory.reduce((a, b) => a + b, 0) / Math.max(rmsHistory.length, 1) || 0.004;
      const baselinePeak =
        peakHistory.reduce((a, b) => a + b, 0) / Math.max(peakHistory.length, 1) || 0.02;

      /*
       * Claps: short high peak OR RMS jump vs recent baseline.
       * Dual check — laptop mics often squash RMS but keep a sharp peak.
       */
      const peakSpike = peak > Math.max(baselinePeak * 2.6, 0.22) && peak > baselinePeak + 0.12;
      const rmsSpike = rms > Math.max(baselineRms * 2.8, 0.035) && rms > baselineRms + 0.028;
      const spike = peakSpike || rmsSpike;

      const now = performance.now();
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
          try {
            onWake?.();
          } catch {
            // ignore wake errors
          }
        }
      }

      /* Expire a lonely first clap so the next pair stays clean. */
      if (clapCount === 1 && now - lastClapAt > doubleClapWindowMs) {
        clapCount = 0;
      }
    };

    rafId = requestAnimationFrame(loop);

    return {
      ready: true,
      stop() {
        stopped = true;
        document.removeEventListener('visibilitychange', onVis);
        if (rafId) cancelAnimationFrame(rafId);
        stream?.getTracks?.().forEach((t) => t.stop());
        stream = null;
        ctx?.close?.().catch(() => {});
        ctx = null;
      },
      setEnabled(value) {
        enabled = Boolean(value);
        if (!enabled) clapCount = 0;
        if (enabled) void resumeCtx();
      },
    };
  } catch (err) {
    console.warn('[jarvis-clap] mic unavailable:', err?.message || err);
    return { stop: () => {}, setEnabled: () => {}, ready: false };
  }
}
