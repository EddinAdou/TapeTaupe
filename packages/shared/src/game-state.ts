export type GameStatus = 'idle' | 'playing' | 'paused' | 'game_over';

export const MOLE_TYPES = ['standard', 'golden', 'speedy', 'bomb'] as const;
export type MoleType = (typeof MOLE_TYPES)[number];

export interface ActiveMole {
  id: number;
  holeIndex: number;
  type: MoleType;
  spawnedAt: number;
  dismissAt: number;
}

export interface GameConfig {
  holeCount: number;
  initialLives: number;
  gameDurationMs: number;
}

export interface GameState {
  status: GameStatus;
  config: GameConfig;
  score: number;
  lives: number;
  level: number;
  combo: number;
  comboMax: number;
  taps: number;
  hits: number;
  misses: number;
  bombsHit: number;
  hitsByType: Record<MoleType, number>;
  timeLeftMs: number;
  startedAt: number | null;
  activeMoles: ActiveMole[];
}

export function createInitialState(config: GameConfig): GameState {
  return {
    status: 'idle',
    config,
    score: 0,
    lives: config.initialLives,
    level: 1,
    combo: 0,
    comboMax: 0,
    taps: 0,
    hits: 0,
    misses: 0,
    bombsHit: 0,
    hitsByType: { standard: 0, golden: 0, speedy: 0, bomb: 0 },
    timeLeftMs: config.gameDurationMs,
    startedAt: null,
    activeMoles: [],
  };
}
