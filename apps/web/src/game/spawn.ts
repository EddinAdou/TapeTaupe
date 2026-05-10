import type { ActiveMole, GameState, MoleType } from '@tapetaupe/shared';

export interface SpawnConfig {
  intervalMinMs: number;
  intervalMaxMs: number;
  lifetimeMs: number;
  maxConcurrent: number;
}

const TYPE_LIFETIME_MS: Record<MoleType, number> = {
  standard: 1400,
  golden: 1100,
  speedy: 700,
  bomb: 1500,
};

const BOMB_MIN_LEVEL = 3;

export function spawnConfigForLevel(level: number): SpawnConfig {
  return {
    intervalMinMs: Math.max(400, 1500 - (level - 1) * 100),
    intervalMaxMs: Math.max(800, 2500 - (level - 1) * 150),
    lifetimeMs: Math.max(700, 1500 - (level - 1) * 80),
    maxConcurrent: 1 + Math.floor((level - 1) / 3),
  };
}

export function spawnWeightsForLevel(level: number): Record<MoleType, number> {
  const speedyWeight = 0.15 * (0.5 + level * 0.2);
  const bombWeight = level < BOMB_MIN_LEVEL ? 0 : 0.07 * (0.4 + level * 0.15);
  return {
    standard: 0.7,
    golden: 0.08,
    speedy: speedyWeight,
    bomb: bombWeight,
  };
}

export function pickMoleType(weights: Record<MoleType, number>, rand: () => number): MoleType {
  const total = weights.standard + weights.golden + weights.speedy + weights.bomb;
  let r = rand() * total;
  r -= weights.standard;
  if (r <= 0) return 'standard';
  r -= weights.golden;
  if (r <= 0) return 'golden';
  r -= weights.speedy;
  if (r <= 0) return 'speedy';
  return 'bomb';
}

export function lifetimeForType(type: MoleType, level: number, rand: () => number): number {
  const base = TYPE_LIFETIME_MS[type];
  const jitter = 0.85 + rand() * 0.3;
  const speedScaling = 1 + (level - 1) * 0.08;
  return Math.max(400, (base * jitter) / speedScaling);
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
