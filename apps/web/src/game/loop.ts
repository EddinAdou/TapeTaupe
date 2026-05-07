import type { GameConfig, GameState } from '@tapetaupe/shared';
import { createInitialState } from '@tapetaupe/shared';

import { isOver, tickTime } from './time';

export type GameListener = (state: Readonly<GameState>) => void;

export interface Game {
  readonly state: Readonly<GameState>;
  start(): void;
  stop(): void;
  tap(holeIndex: number, x: number, y: number): void;
  subscribe(listener: GameListener): () => void;
}

export function createGame(config: GameConfig): Game {
  const state = createInitialState(config);
  const listeners = new Set<GameListener>();
  let rafId: number | null = null;
  let lastFrame: number | null = null;

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

  const loop = (timestamp: number): void => {
    const delta = lastFrame === null ? 0 : timestamp - lastFrame;
    lastFrame = timestamp;
    tickTime(state, delta);
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
    state.startedAt = performance.now();
    lastFrame = null;
    rafId = requestAnimationFrame(loop);
  };

  const tap = (_holeIndex: number, _x: number, _y: number): void => {
    if (state.status !== 'playing') return;
    state.taps += 1;
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
