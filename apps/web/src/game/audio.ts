export type SoundType =
  | 'hitStandard'
  | 'hitGolden'
  | 'hitSpeedy'
  | 'miss'
  | 'bomb'
  | 'levelUp'
  | 'gameOver';

interface AudioGlobal {
  AudioContext?: typeof AudioContext;
  webkitAudioContext?: typeof AudioContext;
}

let audioContext: AudioContext | null = null;
let muted = false;

function getContext(): AudioContext | null {
  if (audioContext) return audioContext;
  const win = globalThis as unknown as AudioGlobal;
  const Ctx = win.AudioContext ?? win.webkitAudioContext;
  if (!Ctx) return null;
  audioContext = new Ctx();
  return audioContext;
}

export function setMuted(value: boolean): void {
  muted = value;
}

export function isMuted(): boolean {
  return muted;
}

function blip(type: OscillatorType, freq: number, durationMs: number, peak = 0.3): void {
  const ctx = getContext();
  if (!ctx || muted) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  osc.connect(gain).connect(ctx.destination);
  const now = ctx.currentTime;
  const duration = durationMs / 1000;
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(peak, now + 0.005);
  gain.gain.linearRampToValueAtTime(0, now + duration);
  osc.start(now);
  osc.stop(now + duration + 0.05);
}

function sweep(
  type: OscillatorType,
  freqStart: number,
  freqEnd: number,
  durationMs: number,
  peak = 0.3,
): void {
  const ctx = getContext();
  if (!ctx || muted) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  const now = ctx.currentTime;
  const duration = durationMs / 1000;
  osc.frequency.setValueAtTime(freqStart, now);
  osc.frequency.linearRampToValueAtTime(freqEnd, now + duration);
  osc.connect(gain).connect(ctx.destination);
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(peak, now + 0.005);
  gain.gain.linearRampToValueAtTime(0, now + duration);
  osc.start(now);
  osc.stop(now + duration + 0.05);
}

function arpeggio(type: OscillatorType, freqs: number[], noteDurationMs: number, peak = 0.3): void {
  const ctx = getContext();
  if (!ctx || muted) return;
  const noteDuration = noteDurationMs / 1000;
  for (const [i, freq] of freqs.entries()) {
    const startTime = ctx.currentTime + i * noteDuration;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    osc.connect(gain).connect(ctx.destination);
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(peak, startTime + 0.01);
    gain.gain.linearRampToValueAtTime(0, startTime + noteDuration);
    osc.start(startTime);
    osc.stop(startTime + noteDuration + 0.05);
  }
}

function playBomb(): void {
  const ctx = getContext();
  if (!ctx || muted) return;
  const bufferSize = Math.floor(ctx.sampleRate * 0.3);
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  const noiseGain = ctx.createGain();
  source.connect(noiseGain).connect(ctx.destination);
  const now = ctx.currentTime;
  noiseGain.gain.setValueAtTime(0, now);
  noiseGain.gain.linearRampToValueAtTime(0.3, now + 0.005);
  noiseGain.gain.linearRampToValueAtTime(0, now + 0.3);
  source.start(now);

  const osc = ctx.createOscillator();
  const oscGain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(120, now);
  osc.frequency.exponentialRampToValueAtTime(40, now + 0.3);
  osc.connect(oscGain).connect(ctx.destination);
  oscGain.gain.setValueAtTime(0, now);
  oscGain.gain.linearRampToValueAtTime(0.4, now + 0.01);
  oscGain.gain.linearRampToValueAtTime(0, now + 0.3);
  osc.start(now);
  osc.stop(now + 0.35);
}

export function playSound(type: SoundType): void {
  switch (type) {
    case 'hitStandard': {
      blip('square', 440, 80);
      return;
    }
    case 'hitGolden': {
      arpeggio('triangle', [660, 880, 1100], 60, 0.25);
      return;
    }
    case 'hitSpeedy': {
      sweep('sawtooth', 550, 880, 120, 0.25);
      return;
    }
    case 'miss': {
      blip('square', 220, 100, 0.2);
      return;
    }
    case 'bomb': {
      playBomb();
      return;
    }
    case 'levelUp': {
      arpeggio('triangle', [523, 659, 784, 1047], 100, 0.3);
      return;
    }
    case 'gameOver': {
      arpeggio('sawtooth', [392, 330, 262, 196], 150, 0.3);
      return;
    }
  }
}
