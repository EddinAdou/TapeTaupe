import type { GameState } from '@tapetaupe/shared';

export interface LastGameStats {
  score: number;
  level: number;
  hits: number;
  accuracy: number;
  maxCombo: number;
  bombsHit: number;
}

let lastStats: LastGameStats | null = null;

export function setLastGameStats(state: Readonly<GameState>): void {
  lastStats = {
    score: state.score,
    level: state.level,
    hits: state.hits,
    accuracy: state.taps > 0 ? Math.round((state.hits / state.taps) * 100) : 0,
    maxCombo: state.comboMax,
    bombsHit: state.bombsHit,
  };
}

export function getLastGameStats(): LastGameStats | null {
  return lastStats;
}
