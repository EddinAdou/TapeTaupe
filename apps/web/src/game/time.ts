import type { GameState } from '@tapetaupe/shared';

export function tickTime(state: GameState, deltaMs: number): void {
  if (state.status !== 'playing') return;
  state.timeLeftMs = Math.max(0, state.timeLeftMs - deltaMs);
}

export function isOver(state: GameState): boolean {
  return state.timeLeftMs <= 0 || state.lives <= 0;
}
