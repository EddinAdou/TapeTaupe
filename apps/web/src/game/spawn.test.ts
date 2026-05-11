import type { ActiveMole, GameState } from '@tapetaupe/shared';
import { createInitialState } from '@tapetaupe/shared';
import { describe, expect, it } from 'vitest';

import {
  addMole,
  expireMoles,
  lifetimeForType,
  pickEmptyHole,
  pickMoleType,
  spawnConfigForLevel,
  spawnWeightsForLevel,
} from './spawn';

function makeState(overrides: Partial<GameState> = {}): GameState {
  const state = createInitialState({
    holeCount: 9,
    initialLives: 3,
    gameDurationMs: 60_000,
  });
  return Object.assign(state, overrides);
}

describe('spawnConfigForLevel', () => {
  it('returns slower cadence at level 1', () => {
    const cfg = spawnConfigForLevel(1);
    expect(cfg.intervalMinMs).toBe(1500);
    expect(cfg.intervalMaxMs).toBe(2500);
    expect(cfg.lifetimeMs).toBe(1500);
    expect(cfg.maxConcurrent).toBe(1);
  });

  it('speeds up at higher levels', () => {
    const lvl5 = spawnConfigForLevel(5);
    expect(lvl5.intervalMinMs).toBeLessThan(1500);
    expect(lvl5.lifetimeMs).toBeLessThan(1500);
    expect(lvl5.maxConcurrent).toBeGreaterThanOrEqual(2);
  });

  it('floors values at the cap', () => {
    const lvl20 = spawnConfigForLevel(20);
    expect(lvl20.intervalMinMs).toBeGreaterThanOrEqual(400);
    expect(lvl20.lifetimeMs).toBeGreaterThanOrEqual(700);
  });
});

describe('pickEmptyHole', () => {
  it('returns null when all holes are occupied', () => {
    const state = makeState({
      activeMoles: Array.from({ length: 9 }, (_, i) => ({
        id: i,
        holeIndex: i,
        type: 'standard' as const,
        spawnedAt: 0,
        dismissAt: 1000,
      })),
    });
    expect(pickEmptyHole(state, () => 0)).toBeNull();
  });

  it('picks the first empty hole with rand=0', () => {
    const state = makeState({
      activeMoles: [
        { id: 1, holeIndex: 0, type: 'standard', spawnedAt: 0, dismissAt: 1 },
        { id: 2, holeIndex: 1, type: 'standard', spawnedAt: 0, dismissAt: 1 },
      ],
    });
    expect(pickEmptyHole(state, () => 0)).toBe(2);
  });

  it('picks the last empty hole with rand close to 1', () => {
    const state = makeState({
      activeMoles: [{ id: 1, holeIndex: 0, type: 'standard', spawnedAt: 0, dismissAt: 1 }],
    });
    expect(pickEmptyHole(state, () => 0.999)).toBe(8);
  });
});

describe('addMole', () => {
  it('appends to activeMoles with computed dismissAt', () => {
    const state = makeState();
    const mole = addMole(state, 3, 'golden', 1000, 800, 42);
    expect(state.activeMoles).toHaveLength(1);
    expect(mole).toEqual({
      id: 42,
      holeIndex: 3,
      type: 'golden',
      spawnedAt: 1000,
      dismissAt: 1800,
    });
  });
});

describe('expireMoles', () => {
  it('removes moles whose dismissAt has passed', () => {
    const state = makeState({
      activeMoles: [
        { id: 1, holeIndex: 0, type: 'standard', spawnedAt: 0, dismissAt: 100 },
        { id: 2, holeIndex: 1, type: 'standard', spawnedAt: 0, dismissAt: 500 },
      ],
    });
    const expired: ActiveMole[] = [];
    expireMoles(state, 200, (m) => expired.push(m));
    expect(state.activeMoles).toHaveLength(1);
    expect(state.activeMoles[0]?.id).toBe(2);
    expect(expired).toHaveLength(1);
    expect(expired[0]?.id).toBe(1);
  });

  it('keeps moles still alive', () => {
    const state = makeState({
      activeMoles: [{ id: 1, holeIndex: 0, type: 'standard', spawnedAt: 0, dismissAt: 1000 }],
    });
    const expired: ActiveMole[] = [];
    expireMoles(state, 500, (m) => expired.push(m));
    expect(state.activeMoles).toHaveLength(1);
    expect(expired).toHaveLength(0);
  });
});

describe('spawnWeightsForLevel', () => {
  it('keeps bomb weight at 0 below level 3', () => {
    expect(spawnWeightsForLevel(1).bomb).toBe(0);
    expect(spawnWeightsForLevel(2).bomb).toBe(0);
  });

  it('introduces bomb from level 3', () => {
    expect(spawnWeightsForLevel(3).bomb).toBeGreaterThan(0);
  });

  it('keeps standard dominant', () => {
    const w = spawnWeightsForLevel(5);
    expect(w.standard).toBeGreaterThan(w.golden);
    expect(w.standard).toBeGreaterThan(w.speedy);
    expect(w.standard).toBeGreaterThan(w.bomb);
  });

  it('scales speedy weight with level', () => {
    expect(spawnWeightsForLevel(5).speedy).toBeGreaterThan(spawnWeightsForLevel(1).speedy);
  });
});

describe('pickMoleType', () => {
  it('returns standard when rand falls in its segment', () => {
    const weights = { standard: 0.7, golden: 0.1, speedy: 0.1, bomb: 0.1 };
    expect(pickMoleType(weights, () => 0)).toBe('standard');
    expect(pickMoleType(weights, () => 0.5)).toBe('standard');
  });

  it('returns golden when rand falls past standard', () => {
    const weights = { standard: 0.7, golden: 0.1, speedy: 0.1, bomb: 0.1 };
    expect(pickMoleType(weights, () => 0.75)).toBe('golden');
  });

  it('returns bomb when rand close to 1', () => {
    const weights = { standard: 0.7, golden: 0.1, speedy: 0.1, bomb: 0.1 };
    expect(pickMoleType(weights, () => 0.99)).toBe('bomb');
  });
});

describe('lifetimeForType', () => {
  it('returns a positive duration', () => {
    expect(lifetimeForType('standard', 1, () => 0.5)).toBeGreaterThan(0);
  });

  it('shortens with higher level', () => {
    const low = lifetimeForType('standard', 1, () => 0.5);
    const high = lifetimeForType('standard', 10, () => 0.5);
    expect(high).toBeLessThan(low);
  });

  it('respects minimum floor of 400 ms', () => {
    expect(lifetimeForType('speedy', 10, () => 0)).toBeGreaterThanOrEqual(400);
  });
});
