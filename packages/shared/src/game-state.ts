export type GameStatus = 'idle' | 'playing' | 'paused' | 'game_over';

export const MOLE_TYPES = ['standard', 'golden', 'speedy', 'bomb'] as const;
export type MoleType = (typeof MOLE_TYPES)[number];
