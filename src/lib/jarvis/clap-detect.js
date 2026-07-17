'use client';

/**
 * Clap wake detector (Web Audio).
 * Default: ONE sharp clap (laptop-friendly). Optional requireCount for double-clap.
 * Auto-recovers if the capture stream goes silent (common when SpeechRecognition
 * also holds the mic on Windows).
 */
export async function createClapDetector({
  onDoubleClap,
  onTripleClap,
  onClap,
  shouldListen = () => true,
  /** 1 = single clap wake, 2 = classic double-clap */
  requireCount = 1,
  clapWindowMs = 1100,
  minClapGapMs = 90,
  cooldownMs = 2000,
  onLevel,
  /** When false, do not open getUserMedia until setEnabled(true). */
  startEnabled = true,
} = {}) {
  if (typeof window === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
    return { stop: () => {}, setEnabled: () => {}, ready: false, hasMic: () => false };
  }

  const onWake = onClap || onDoubleClap || onTripleClap;
  const needed = Math.max(1, Math.min(3, requireCount | 0));

  let stream = null;
  let ctx = null;
  let analyser = null;
  let rafId = null;
  let enabled = Boolean(startEnabled);
  let stopped = false;
  let sourceNode = null;
  let filterNode = null;

  let clapCount = 0;
  let lastClapAt = 0;
  let lastPeakAt = 0;
  let lastActivateAt = 0;
  let prevPeak = 0;
  let silenceFrames = 0;
  let recreating = false;

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

  const tearGraph = () => {
    try {
      sourceNode?.disconnect();
    } catch {
      // ignore
    }
    try {
      filterNode?.disconnect();
    } catch {
      // ignore
    }
    sourceNode = null;
    filterNode = null;
    analyser = null;
    stream?.getTracks?.().forEach((t) => {
      try {
        t.stop();
      } catch {
        // ignore
      }
    });
    stream = null;
  };

  const buildGraph = async () => {
    tearGraph();
    stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false,
        channelCount: 1,
      },
    });
    if (!ctx || ctx.state === 'closed') {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      ctx = new Ctx();
    }
    await resumeCtx();

    sourceNode = ctx.createMediaStreamSource(stream);
    filterNode = ctx.createBiquadFilter();
    filterNode.type = 'highpass';
    /* Broadband transient — not so high that laptop mics lose the clap */
    filterNode.frequency.value = 900;
    filterNode.Q.value = 0.707;

    analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = 0;

    sourceNode.connect(filterNode);
    filterNode.connect(analyser);
    silenceFrames = 0;
    prevPeak = 0;
    peakHistory.length = 0;
  };

  const timeData = new Uint8Array(256);

  const loop = () => {
    if (stopped) return;
    rafId = requestAnimationFrame(loop);
    if (!enabled || !shouldListen() || !analyser || recreating) return;
    if (ctx?.state === 'suspended') {
      void resumeCtx();
      return;
    }

    analyser.getByteTimeDomainData(timeData);
    let peak = 0;
    let sum = 0;
    for (let i = 0; i < timeData.length; i += 1) {
      const v = (timeData[i] - 128) / 128;
      const a = Math.abs(v);
      if (a > peak) peak = a;
      sum += v * v;
    }
    const rms = Math.sqrt(sum / timeData.length);
    const onset = Math.max(0, peak - prevPeak);
    prevPeak = peak * 0.65; // decay so successive claps still register

    peakHistory.push(peak);
    if (peakHistory.length > 40) peakHistory.shift();
    const baseline =
      peakHistory.reduce((a, b) => a + b, 0) / Math.max(peakHistory.length, 1) || 0.015;

    onLevel?.(Math.min(1, peak * 1.6));

    /* Dead mic detection — recreate capture if stuck near silence */
    if (peak < 0.008 && rms < 0.004) {
      silenceFrames += 1;
      if (silenceFrames > 180 && !recreating) {
        /* ~3s at 60fps */
        recreating = true;
        void buildGraph()
          .catch(() => undefined)
          .finally(() => {
            recreating = false;
          });
      }
    } else {
      silenceFrames = 0;
    }

    /*
     * Clap = sharp onset + absolute peak above quiet-room baseline.
     * Tuned low for built-in mics; cooldown + short gap avoid speech false wakes.
     */
    const sharp =
      onset > Math.max(0.055, baseline * 1.5) &&
      peak > Math.max(0.10, baseline + 0.055) &&
      peak > baseline * 1.7;

    const now = performance.now();
    if (sharp && now - lastPeakAt > minClapGapMs) {
      lastPeakAt = now;
      if (needed === 1 || now - lastClapAt <= clapWindowMs) {
        clapCount += 1;
      } else {
        clapCount = 1;
      }
      lastClapAt = now;

      if (clapCount >= needed && now - lastActivateAt >= cooldownMs) {
        clapCount = 0;
        lastActivateAt = now;
        try {
          onWake?.();
        } catch {
          // ignore
        }
      }
    }

    if (clapCount > 0 && needed > 1 && now - lastClapAt > clapWindowMs) {
      clapCount = 0;
    }
  };

  try {
    if (startEnabled) {
      await buildGraph();
    }
  } catch (err) {
    console.warn('[jarvis-clap] mic unavailable:', err?.message || err);
    return { stop: () => {}, setEnabled: () => {}, ready: false, hasMic: () => false };
  }

  const onVis = () => {
    if (document.visibilityState === 'visible') void resumeCtx();
  };
  const onPointer = () => {
    void resumeCtx();
  };
  document.addEventListener('visibilitychange', onVis);
  document.addEventListener('pointerdown', onPointer, { passive: true });

  rafId = requestAnimationFrame(loop);

  return {
    ready: true,
    /** True while MediaStream tracks are open (blocks SpeechRecognition on many browsers). */
    hasMic() {
      return Boolean(stream?.getTracks?.().some((t) => t.readyState === 'live'));
    },
    stop() {
      stopped = true;
      document.removeEventListener('visibilitychange', onVis);
      document.removeEventListener('pointerdown', onPointer);
      if (rafId) cancelAnimationFrame(rafId);
      tearGraph();
      ctx?.close?.().catch(() => {});
      ctx = null;
    },
    /**
     * When disabled, RELEASE the mic — do not keep a live getUserMedia stream.
     * SpeechRecognition cannot hear while clap holds the device (Windows/Chrome).
     */
    setEnabled(value) {
      enabled = Boolean(value);
      if (!enabled) {
        clapCount = 0;
        tearGraph();
        return;
      }
      if (stopped) return;
      if (!stream) {
        recreating = true;
        void buildGraph()
          .catch(() => undefined)
          .finally(() => {
            recreating = false;
          });
      } else {
        void resumeCtx();
      }
    },
    async recreate() {
      if (stopped || recreating || !enabled) return;
      recreating = true;
      try {
        await buildGraph();
      } catch {
        // ignore
      } finally {
        recreating = false;
      }
    },
  };
}
