export interface ScoreSubmission {
  pseudo: string;
  score: number;
  levelReached: number;
  comboMax: number;
  accuracyPercent: number;
  gameSessionId: string;
}

export interface ScoreEntry extends ScoreSubmission {
  id: number;
  createdAt: number;
}
