import type { ActiveMole, GameConfig, GameState } from '@tapetaupe/shared';
import { createInitialState } from '@tapetaupe/shared';

import { applyHit, applyMiss } from './scoring';
import { addMole, expireMoles, pickEmptyHole, spawnConfigForLevel } from './spawn';
import { isOver, tickTime } from './time';

export type GameListener = (state: Readonly<GameState>) => void;

export interface Game {
  readonly state: Readonly<GameState>;
  start(): void;
  stop(): void;
  tap(holeIndex: number, x: number, y: number): void;
  subscribe(listener: GameListener): () => void;
}

export interface CreateGameOptions {
  rand?: () => number;
  now?: () => number;
}

const FIRST_SPAWN_DELAY_MS = 500;

export function createGame(config: GameConfig, options: CreateGameOptions = {}): Game {
  const rand = options.rand ?? Math.random;
  const now = options.now ?? performance.now.bind(performance);

  const state = createInitialState(config);
  const listeners = new Set<GameListener>();
  let rafId: number | null = null;
  let lastFrame: number | null = null;
  let nextSpawnAt = 0;
  let nextMoleId = 1;

  const notify = (): void => {
    for (const listener of listeners) listener(state);
  };

  const stop = (): void => {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    lastFrame = null;
  };

  const scheduleNextSpawn = (currentTime: number, level: number): void => {
    const cfg = spawnConfigForLevel(level);
    nextSpawnAt =
      currentTime + cfg.intervalMinMs + rand() * (cfg.intervalMaxMs - cfg.intervalMinMs);
  };

  const handleSpawn = (currentTime: number): void => {
    const cfg = spawnConfigForLevel(state.level);
    if (state.activeMoles.length >= cfg.maxConcurrent) return;
    if (currentTime < nextSpawnAt) return;
    const holeIndex = pickEmptyHole(state, rand);
    if (holeIndex === null) {
      scheduleNextSpawn(currentTime, state.level);
      return;
    }
    addMole(state, holeIndex, 'standard', currentTime, cfg.lifetimeMs, nextMoleId++);
    scheduleNextSpawn(currentTime, state.level);
  };

  const handleExpire = (mole: ActiveMole): void => {
    if (mole.type === 'bomb') return;
    state.lives = Math.max(0, state.lives - 1);
    state.combo = 0;
    state.misses += 1;
  };

  const loop = (timestamp: number): void => {
    const delta = lastFrame === null ? 0 : timestamp - lastFrame;
    lastFrame = timestamp;
    tickTime(state, delta);
    expireMoles(state, timestamp, handleExpire);
    handleSpawn(timestamp);
    if (isOver(state)) {
      state.status = 'game_over';
      stop();
      notify();
      return;
    }
    notify();
    rafId = requestAnimationFrame(loop);
  };

  const start = (): void => {
    if (state.status !== 'idle' && state.status !== 'paused') return;
    state.status = 'playing';
    const startTime = now();
    state.startedAt = startTime;
    nextSpawnAt = startTime + FIRST_SPAWN_DELAY_MS;
    lastFrame = null;
    rafId = requestAnimationFrame(loop);
  };

  const tap = (holeIndex: number, _x: number, _y: number): void => {
    if (state.status !== 'playing') return;
    state.taps += 1;
    const moleIndex = state.activeMoles.findIndex((m) => m.holeIndex === holeIndex);
    if (moleIndex === -1) {
      applyMiss(state);
    } else {
      const mole = state.activeMoles[moleIndex];
      if (mole === undefined) return;
      applyHit(state, mole);
      state.activeMoles.splice(moleIndex, 1);
    }
    if (isOver(state)) {
      state.status = 'game_over';
      stop();
    }
    notify();
  };

  const subscribe = (listener: GameListener): (() => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  };

  return {
    get state() {
      return state;
    },
    start,
    stop,
    tap,
    subscribe,
  };
}
