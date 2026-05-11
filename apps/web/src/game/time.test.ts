import type { GameState } from '@tapetaupe/shared';
import { createInitialState } from '@tapetaupe/shared';
import { describe, expect, it } from 'vitest';

import { isOver, tickTime } from './time';

function makeState(overrides: Partial<GameState> = {}): GameState {
  const state = createInitialState({
    holeCount: 9,
    initialLives: 3,
    gameDurationMs: 60_000,
  });
  return Object.assign(state, overrides);
}

describe('tickTime', () => {
  it('reduces timeLeftMs while playing', () => {
    const state = makeState({ status: 'playing', timeLeftMs: 10_000 });
    tickTime(state, 250);
    expect(state.timeLeftMs).toBe(9750);
  });

  it('is a no-op when idle', () => {
    const state = makeState({ status: 'idle', timeLeftMs: 10_000 });
    tickTime(state, 500);
    expect(state.timeLeftMs).toBe(10_000);
  });

  it('is a no-op when paused', () => {
    const state = makeState({ status: 'paused', timeLeftMs: 10_000 });
    tickTime(state, 500);
    expect(state.timeLeftMs).toBe(10_000);
  });

  it('clamps timeLeftMs at 0', () => {
    const state = makeState({ status: 'playing', timeLeftMs: 100 });
    tickTime(state, 500);
    expect(state.timeLeftMs).toBe(0);
  });
});

describe('isOver', () => {
  it('returns true when lives reach 0', () => {
    expect(isOver(makeState({ lives: 0, timeLeftMs: 10_000 }))).toBe(true);
  });

  it('returns true when time reaches 0', () => {
    expect(isOver(makeState({ lives: 3, timeLeftMs: 0 }))).toBe(true);
  });

  it('returns true when both are 0', () => {
    expect(isOver(makeState({ lives: 0, timeLeftMs: 0 }))).toBe(true);
  });

  it('returns false when both are positive', () => {
    expect(isOver(makeState({ lives: 1, timeLeftMs: 1 }))).toBe(false);
  });
});
