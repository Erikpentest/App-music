import { EqualizerSettings } from '../types';

export const EQUALIZER_FREQUENCIES = [60, 170, 310, 600, 1000, 3000, 6000, 12000, 14000, 16000];

class AudioEngine {
  private audioCtx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private gainNode: GainNode | null = null;
  private filters: BiquadFilterNode[] = [];
  private mediaSourceMap: WeakMap<HTMLAudioElement, MediaElementAudioSourceNode> = new WeakMap();

  public getContext(): AudioContext {
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      this.audioCtx = new AudioCtxClass();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  public attachAudioElement(audioElement: HTMLAudioElement): AnalyserNode {
    const ctx = this.getContext();

    if (!this.analyser) {
      this.analyser = ctx.createAnalyser();
      this.analyser.fftSize = 256;
      this.analyser.smoothingTimeConstant = 0.82;
    }

    if (!this.gainNode) {
      this.gainNode = ctx.createGain();
      this.gainNode.gain.value = 1.0;
    }

    // Build 10-band equalizer filter chain if not built
    if (this.filters.length === 0) {
      this.filters = EQUALIZER_FREQUENCIES.map((freq, index) => {
        const filter = ctx.createBiquadFilter();
        if (index === 0) {
          filter.type = 'lowshelf';
        } else if (index === EQUALIZER_FREQUENCIES.length - 1) {
          filter.type = 'highshelf';
        } else {
          filter.type = 'peaking';
          filter.Q.value = 1.4;
        }
        filter.frequency.value = freq;
        filter.gain.value = 0;
        return filter;
      });

      // Connect filter chain: Filter 0 -> Filter 1 -> ... -> Filter 9 -> Gain -> Analyser -> Destination
      for (let i = 0; i < this.filters.length - 1; i++) {
        this.filters[i].connect(this.filters[i + 1]);
      }
      this.filters[this.filters.length - 1].connect(this.gainNode);
      this.gainNode.connect(this.analyser);
      this.analyser.connect(ctx.destination);
    }

    // Connect source element to first filter
    if (!this.mediaSourceMap.has(audioElement)) {
      try {
        const source = ctx.createMediaElementSource(audioElement);
        source.connect(this.filters[0]);
        this.mediaSourceMap.set(audioElement, source);
      } catch (e) {
        // Source already created or CORS limitation
      }
    }

    return this.analyser;
  }

  public applyEqualizerSettings(settings: EqualizerSettings) {
    if (this.filters.length === 0) return;

    if (!settings.enabled) {
      // Flat equalizer
      this.filters.forEach(filter => {
        filter.gain.value = 0;
      });
      if (this.gainNode) this.gainNode.gain.value = 1.0;
      return;
    }

    // Pre-gain scaling
    if (this.gainNode) {
      const db = settings.preGain;
      this.gainNode.gain.value = Math.pow(10, db / 20);
    }

    // Apply band gain values
    settings.bands.forEach((gainDb, index) => {
      if (this.filters[index]) {
        this.filters[index].gain.value = gainDb;
      }
    });
  }

  public getFrequencyData(array: Uint8Array) {
    if (this.analyser) {
      this.analyser.getByteFrequencyData(array);
    }
  }

  public getWaveformData(array: Uint8Array) {
    if (this.analyser) {
      this.analyser.getByteTimeDomainData(array);
    }
  }

  // Synth sound generator for Beat Sequencer
  public playSynthSound(type: 'kick' | 'snare' | 'hihat' | 'bass' | 'lead', frequency?: number) {
    const ctx = this.getContext();
    const now = ctx.currentTime;

    if (type === 'kick') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(0.01, now + 0.3);
      gain.gain.setValueAtTime(1, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.3);
    } else if (type === 'snare') {
      const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.15, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < noiseBuffer.length; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = noiseBuffer;

      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'highpass';
      noiseFilter.frequency.value = 800;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.6, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

      noise.connect(noiseFilter);
      noiseFilter.connect(gain);
      gain.connect(ctx.destination);
      noise.start(now);
    } else if (type === 'hihat') {
      const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.05, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < noiseBuffer.length; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = noiseBuffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.value = 7000;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start(now);
    } else if (type === 'bass') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(frequency || 110, now);
      gain.gain.setValueAtTime(0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(600, now);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.25);
    } else if (type === 'lead') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(frequency || 440, now);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.3);
    }
  }
}

export const audioEngine = new AudioEngine();
