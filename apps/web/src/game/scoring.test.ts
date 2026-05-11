import type { ActiveMole, GameState } from '@tapetaupe/shared';
import { createInitialState } from '@tapetaupe/shared';
import { describe, expect, it } from 'vitest';

import { applyHit, applyMiss, computeLevel, pointsForType } from './scoring';

function makeState(overrides: Partial<GameState> = {}): GameState {
  const state = createInitialState({
    holeCount: 9,
    initialLives: 3,
    gameDurationMs: 60_000,
  });
  return Object.assign(state, overrides);
}

function makeMole(type: ActiveMole['type'], holeIndex = 0): ActiveMole {
  return { id: 1, holeIndex, type, spawnedAt: 0, dismissAt: 1000 };
}

describe('pointsForType', () => {
  it('returns the right amount per type', () => {
    expect(pointsForType('standard')).toBe(10);
    expect(pointsForType('golden')).toBe(50);
    expect(pointsForType('speedy')).toBe(20);
    expect(pointsForType('bomb')).toBe(0);
  });
});

describe('computeLevel', () => {
  it('starts at 1', () => {
    expect(computeLevel(0)).toBe(1);
    expect(computeLevel(249)).toBe(1);
  });

  it('increments every 250 points', () => {
    expect(computeLevel(250)).toBe(2);
    expect(computeLevel(500)).toBe(3);
    expect(computeLevel(1000)).toBe(5);
  });

  it('caps at 10', () => {
    expect(computeLevel(2250)).toBe(10);
    expect(computeLevel(2500)).toBe(10);
    expect(computeLevel(99_999)).toBe(10);
  });
});

describe('applyHit — standard', () => {
  it('adds 10 points, increments hit and combo', () => {
    const state = makeState();
    const result = applyHit(state, makeMole('standard'));
    expect(result).toEqual({ boosted: false, earned: 10 });
    expect(state.score).toBe(10);
    expect(state.hits).toBe(1);
    expect(state.combo).toBe(1);
    expect(state.comboMax).toBe(1);
    expect(state.hitsByType.standard).toBe(1);
  });
});

describe('applyHit — golden', () => {
  it('adds 50 points', () => {
    const state = makeState();
    const result = applyHit(state, makeMole('golden'));
    expect(result).toEqual({ boosted: false, earned: 50 });
    expect(state.score).toBe(50);
    expect(state.hitsByType.golden).toBe(1);
  });
});

describe('applyHit — speedy', () => {
  it('adds 20 points and sets boost to 3 charges', () => {
    const state = makeState();
    const result = applyHit(state, makeMole('speedy'));
    expect(result).toEqual({ boosted: false, earned: 20 });
    expect(state.score).toBe(20);
    expect(state.boostHitsLeft).toBe(3);
  });

  it('keeps boost at 3 if hit while already boosted', () => {
    const state = makeState({ boostHitsLeft: 1 });
    const result = applyHit(state, makeMole('speedy'));
    expect(result.boosted).toBe(true);
    expect(result.earned).toBe(40);
    expect(state.boostHitsLeft).toBe(3);
  });
});

describe('applyHit — bomb', () => {
  it('decrements lives and combo without points', () => {
    const state = makeState({ combo: 5 });
    const result = applyHit(state, makeMole('bomb'));
    expect(result).toEqual({ boosted: false, earned: 0 });
    expect(state.bombsHit).toBe(1);
    expect(state.lives).toBe(2);
    expect(state.combo).toBe(0);
    expect(state.score).toBe(0);
  });

  it('does not consume boost charge', () => {
    const state = makeState({ boostHitsLeft: 2 });
    applyHit(state, makeMole('bomb'));
    expect(state.boostHitsLeft).toBe(2);
  });
});

describe('applyHit — boost multiplier', () => {
  it('doubles standard hit when boost active and decrements charges', () => {
    const state = makeState({ boostHitsLeft: 3 });
    const result = applyHit(state, makeMole('standard'));
    expect(result).toEqual({ boosted: true, earned: 20 });
    expect(state.score).toBe(20);
    expect(state.boostHitsLeft).toBe(2);
  });

  it('doubles golden hit when boost active', () => {
    const state = makeState({ boostHitsLeft: 1 });
    const result = applyHit(state, makeMole('golden'));
    expect(result.earned).toBe(100);
    expect(state.boostHitsLeft).toBe(0);
  });
});

describe('applyMiss', () => {
  it('decrements lives and resets combo', () => {
    const state = makeState({ combo: 4 });
    applyMiss(state);
    expect(state.misses).toBe(1);
    expect(state.lives).toBe(2);
    expect(state.combo).toBe(0);
  });

  it('clamps lives at 0', () => {
    const state = makeState({ lives: 0 });
    applyMiss(state);
    expect(state.lives).toBe(0);
  });
});
