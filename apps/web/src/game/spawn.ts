import type { ActiveMole, GameState, MoleType } from '@tapetaupe/shared';

export interface SpawnConfig {
  intervalMinMs: number;
  intervalMaxMs: number;
  lifetimeMs: number;
  maxConcurrent: number;
}

export function spawnConfigForLevel(level: number): SpawnConfig {
  return {
    intervalMinMs: Math.max(400, 1500 - (level - 1) * 100),
    intervalMaxMs: Math.max(800, 2500 - (level - 1) * 150),
    lifetimeMs: Math.max(700, 1500 - (level - 1) * 80),
    maxConcurrent: 1 + Math.floor((level - 1) / 3),
  };
}

export function pickEmptyHole(state: GameState, rand: () => number): number | null {
  const occupied = new Set(state.activeMoles.map((m) => m.holeIndex));
  const empty: number[] = [];
  for (let i = 0; i < state.config.holeCount; i++) {
    if (!occupied.has(i)) empty.push(i);
  }
  if (empty.length === 0) return null;
  return empty[Math.floor(rand() * empty.length)] ?? null;
}

export function addMole(
  state: GameState,
  holeIndex: number,
  type: MoleType,
  spawnedAt: number,
  lifetimeMs: number,
  id: number,
): ActiveMole {
  const mole: ActiveMole = {
    id,
    holeIndex,
    type,
    spawnedAt,
    dismissAt: spawnedAt + lifetimeMs,
  };
  state.activeMoles.push(mole);
  return mole;
}

export function expireMoles(
  state: GameState,
  now: number,
  onExpire: (mole: ActiveMole) => void,
): void {
  const remaining: ActiveMole[] = [];
  for (const mole of state.activeMoles) {
    if (mole.dismissAt <= now) {
      onExpire(mole);
    } else {
      remaining.push(mole);
    }
  }
  state.activeMoles = remaining;
}
