export interface Lobby {
  lobbyId: string;
  lobbyName: string;
  players: Player[];
  status: 'waiting' | 'playing' | 'finished';
  game: GameState;
}

export interface Player {
  id: string;
  socketId: string;
  username: string;
  connected?: boolean
}

export interface GameState {
  status: "waiting" | "playing" | "finished";

  players: GamePlayer[];

  currentPlayerId: string;

  dice: Dice[];

  turnScore: number;
  // totalScores: Record<string, number>;

  rolled: boolean;
}

export interface GamePlayer {
  id: string;
  username: string;
  score: number;
  connected: boolean;
}

export type DiceValue = 1 | 2 | 3 | 4 | 5 | 6;

export interface Dice {
  id: number;
  value: DiceValue;
  selected: boolean;
  selectable: boolean;
}