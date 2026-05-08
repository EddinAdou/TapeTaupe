import type { ActiveMole, GameState, MoleType } from '@tapetaupe/shared';

const POINTS: Record<MoleType, number> = {
  standard: 10,
  golden: 50,
  speedy: 20,
  bomb: 0,
};

export function pointsForType(type: MoleType): number {
  return POINTS[type];
}

export function applyHit(state: GameState, mole: ActiveMole): void {
  if (mole.type === 'bomb') {
    state.bombsHit += 1;
    state.lives = Math.max(0, state.lives - 1);
    state.combo = 0;
    return;
  }
  state.score += pointsForType(mole.type);
  state.hits += 1;
  state.combo += 1;
  state.comboMax = Math.max(state.comboMax, state.combo);
  state.hitsByType[mole.type] += 1;
}

export function applyMiss(state: GameState): void {
  state.misses += 1;
  state.lives = Math.max(0, state.lives - 1);
  state.combo = 0;
}
