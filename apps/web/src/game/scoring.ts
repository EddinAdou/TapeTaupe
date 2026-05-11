import type { ActiveMole, GameState, MoleType } from '@tapetaupe/shared';

const POINTS: Record<MoleType, number> = {
  standard: 10,
  golden: 50,
  speedy: 20,
  bomb: 0,
};

export const MAX_LEVEL = 10;
export const POINTS_PER_LEVEL = 250;

export function pointsForType(type: MoleType): number {
  return POINTS[type];
}

export function computeLevel(score: number): number {
  return Math.min(MAX_LEVEL, 1 + Math.floor(score / POINTS_PER_LEVEL));
}

export interface HitOutcome {
  boosted: boolean;
  earned: number;
}

const BOOST_CHARGES = 3;
const BOOST_MULTIPLIER = 2;

export function applyHit(state: GameState, mole: ActiveMole): HitOutcome {
  if (mole.type === 'bomb') {
    state.bombsHit += 1;
    state.lives = Math.max(0, state.lives - 1);
    state.combo = 0;
    return { boosted: false, earned: 0 };
  }
  const boosted = state.boostHitsLeft > 0;
  const multiplier = boosted ? BOOST_MULTIPLIER : 1;
  const earned = pointsForType(mole.type) * multiplier;
  state.score += earned;
  state.hits += 1;
  state.combo += 1;
  state.comboMax = Math.max(state.comboMax, state.combo);
  state.hitsByType[mole.type] += 1;
  if (mole.type === 'speedy') {
    state.boostHitsLeft = BOOST_CHARGES;
  } else if (state.boostHitsLeft > 0) {
    state.boostHitsLeft -= 1;
  }
  return { boosted, earned };
}

export function applyMiss(state: GameState): void {
  state.misses += 1;
  state.lives = Math.max(0, state.lives - 1);
  state.combo = 0;
}
