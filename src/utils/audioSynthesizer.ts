/**
 * Lightweight procedural Web Audio soundscape engine
 * Synthesizes peaceful nature & focus ambient sound without external audio files.
 */

class SoundscapeEngine {
  private ctx: AudioContext | null = null;
  private currentMode: 'rain' | 'waves' | 'calm432' | 'whitenoise' | null = null;
  private masterGain: GainNode | null = null;
  private isRunning: boolean = false;
  private activeNodes: AudioNode[] = [];

  private getContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public start(mode: 'rain' | 'waves' | 'calm432' | 'whitenoise', volume: number = 0.25) {
    this.stop();
    const ctx = this.getContext();

    this.masterGain = ctx.createGain();
    this.masterGain.gain.setValueAtTime(volume, ctx.currentTime);
    this.masterGain.connect(ctx.destination);
    this.currentMode = mode;
    this.isRunning = true;

    if (mode === 'calm432') {
      // Harmonic 432Hz deep meditative sine tone with subtle binaural 436Hz beating
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const osc3 = ctx.createOscillator();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(432, ctx.currentTime);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(436, ctx.currentTime); // 4Hz delta = gentle theta wave

      osc3.type = 'sine';
      osc3.frequency.setValueAtTime(216, ctx.currentTime); // Sub-octave warmth

      const g1 = ctx.createGain();
      const g2 = ctx.createGain();
      const g3 = ctx.createGain();

      g1.gain.setValueAtTime(0.18, ctx.currentTime);
      g2.gain.setValueAtTime(0.12, ctx.currentTime);
      g3.gain.setValueAtTime(0.15, ctx.currentTime);

      osc1.connect(g1);
      osc2.connect(g2);
      osc3.connect(g3);

      g1.connect(this.masterGain);
      g2.connect(this.masterGain);
      g3.connect(this.masterGain);

      osc1.start();
      osc2.start();
      osc3.start();

      this.activeNodes.push(osc1, osc2, osc3, g1, g2, g3);
    } else if (mode === 'whitenoise' || mode === 'rain' || mode === 'waves') {
      // Procedural buffer noise generator
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let lastOut = 0.0;

      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        if (mode === 'rain') {
          // Pink/brown filtered noise
          output[i] = (lastOut + 0.02 * white) / 1.02;
          lastOut = output[i];
          output[i] *= 3.5;
        } else if (mode === 'waves') {
          // Rolling swell noise
          output[i] = (lastOut + 0.04 * white) / 1.04;
          lastOut = output[i];
          output[i] *= 3.0;
        } else {
          output[i] = white * 0.15;
        }
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      // Filter
      const filter = ctx.createBiquadFilter();
      filter.type = mode === 'rain' ? 'lowpass' : mode === 'waves' ? 'bandpass' : 'lowpass';
      filter.frequency.setValueAtTime(mode === 'rain' ? 850 : mode === 'waves' ? 400 : 1200, ctx.currentTime);

      if (mode === 'waves') {
        // Modulate filter for wave surges
        const lfo = ctx.createOscillator();
        lfo.frequency.setValueAtTime(0.12, ctx.currentTime); // 8-second wave swell
        const lfoGain = ctx.createGain();
        lfoGain.gain.setValueAtTime(250, ctx.currentTime);
        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);
        lfo.start();
        this.activeNodes.push(lfo, lfoGain);
      }

      whiteNoise.connect(filter);
      filter.connect(this.masterGain);
      whiteNoise.start();

      this.activeNodes.push(whiteNoise, filter);
    }
  }

  public setVolume(volume: number) {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(Math.max(0, Math.min(1, volume)), this.ctx.currentTime, 0.05);
    }
  }

  public stop() {
    this.activeNodes.forEach((node) => {
      try {
        if (typeof (node as unknown as { stop?: () => void }).stop === 'function') {
          (node as unknown as { stop: () => void }).stop();
        }
        if (typeof node.disconnect === 'function') {
          node.disconnect();
        }
      } catch {
        // Ignore stop error
      }
    });
    this.activeNodes = [];
    this.currentMode = null;
    this.isRunning = false;
  }

  public getActiveMode() {
    return this.currentMode;
  }

  public getIsRunning() {
    return this.isRunning;
  }
}

export const soundscape = new SoundscapeEngine();
