export interface Die {
  value: number;      // 1–6
  locked: boolean;    // ausgewählt?
}

export interface Player {
  id: string;
  name: string;
  score: number;
  roundScore: number;
}

export type GamePhase =
  | "waiting"
  | "rolling"
  | "selecting"
  | "end";

export interface GameState {
  players: Player[];
  dice: Die[];
  currentPlayer: number;
  phase: GamePhase;
}