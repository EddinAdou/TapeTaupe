import { Howl } from 'howler';

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

const SFX_PATHS: Record<SoundType, string> = {
  hitStandard: '/audio/hit-standard.ogg',
  hitGolden: '/audio/hit-golden.ogg',
  hitSpeedy: '/audio/hit-speedy.ogg',
  miss: '/audio/miss.ogg',
  bomb: '/audio/bomb.ogg',
  levelUp: '/audio/level-up.ogg',
  gameOver: '/audio/game-over.mp3',
};

const MUSIC_TRACKS = [
  '/audio/music-1.mp3',
  '/audio/music-2.mp3',
  '/audio/music-3.mp3',
  '/audio/music-4.mp3',
  '/audio/music-5.mp3',
  '/audio/music-6.mp3',
];
const AMBIENT_PATH = '/audio/wind-loop.mp3';
const SFX_VOLUME = 0.8;
const MUSIC_VOLUME = 0.3;
const AMBIENT_VOLUME = 0.4;

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

interface SfxEntry {
  howl: Howl;
  failed: boolean;
}

const sfxCache = new Map<SoundType, SfxEntry>();

function getSfx(type: SoundType): SfxEntry {
  const cached = sfxCache.get(type);
  if (cached) return cached;
  const entry: SfxEntry = { howl: null as unknown as Howl, failed: false };
  entry.howl = new Howl({
    src: [SFX_PATHS[type]],
    volume: SFX_VOLUME,
    preload: true,
    onloaderror: () => {
      entry.failed = true;
    },
  });
  sfxCache.set(type, entry);
  return entry;
}

const musicCache = new Map<string, Howl>();
let currentMusic: Howl | null = null;
let ambientHowl: Howl | null = null;
let currentAmbient: Howl | null = null;
let ambientFailed = false;

function getMusicHowl(src: string): Howl {
  const cached = musicCache.get(src);
  if (cached) return cached;
  const h = new Howl({
    src: [src],
    loop: true,
    volume: 0,
    preload: true,
  });
  musicCache.set(src, h);
  return h;
}

function getAmbientHowl(): Howl | null {
  if (ambientFailed) return null;
  if (ambientHowl) return ambientHowl;
  ambientHowl = new Howl({
    src: [AMBIENT_PATH],
    loop: true,
    volume: 0,
    preload: true,
    onloaderror: () => {
      ambientFailed = true;
      ambientHowl = null;
    },
  });
  return ambientHowl;
}

function pickRandomTrack(): string {
  const idx = Math.floor(Math.random() * MUSIC_TRACKS.length);
  return MUSIC_TRACKS[idx] ?? MUSIC_TRACKS[0] ?? '';
}

export function setMuted(value: boolean): void {
  muted = value;
  if (currentMusic) {
    if (value) currentMusic.pause();
    else currentMusic.play();
  }
  if (currentAmbient) {
    if (value) currentAmbient.pause();
    else currentAmbient.play();
  }
}

export function isMuted(): boolean {
  return muted;
}

export function startMusic(): void {
  if (muted) return;
  stopAmbient(300);
  if (currentMusic && currentMusic.playing()) return;
  const track = pickRandomTrack();
  if (!track) return;
  const h = getMusicHowl(track);
  if (!h.playing()) h.play();
  h.fade(0, MUSIC_VOLUME, 600);
  currentMusic = h;
}

export function stopMusic(fadeMs = 400): void {
  if (!currentMusic) return;
  const h = currentMusic;
  currentMusic = null;
  h.fade(h.volume(), 0, fadeMs);
  setTimeout(() => h.stop(), fadeMs);
}

export function startAmbient(): void {
  if (muted) return;
  stopMusic(300);
  if (currentAmbient && currentAmbient.playing()) return;
  const h = getAmbientHowl();
  if (!h) return;
  if (!h.playing()) h.play();
  h.fade(0, AMBIENT_VOLUME, 800);
  currentAmbient = h;
}

export function stopAmbient(fadeMs = 400): void {
  if (!currentAmbient) return;
  const h = currentAmbient;
  currentAmbient = null;
  h.fade(h.volume(), 0, fadeMs);
  setTimeout(() => h.stop(), fadeMs);
}

function blip(type: OscillatorType, freq: number, durationMs: number, peak = 0.3): void {
  const ctx = getContext();
  if (!ctx) return;
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
  if (!ctx) return;
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
  if (!ctx) return;
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

function playBombSynth(): void {
  const ctx = getContext();
  if (!ctx) return;
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

function playSynth(type: SoundType): void {
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
      playBombSynth();
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

export function playSound(type: SoundType): void {
  if (muted) return;
  const entry = getSfx(type);
  if (entry.failed) {
    playSynth(type);
    return;
  }
  entry.howl.play();
}
