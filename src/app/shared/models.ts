export interface SocketResponse {
  success: boolean;
  error?: string;
}

export interface SavedLobbyDetails {
  username: string;
  playerId: string;
  lobbyId:  string;
  password: string;
}

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
  rolled: boolean;
  farkled: boolean;
  maxPoints: number;
}

export interface GamePlayer {
  id: string;
  username: string;
  score: number;
  connected: boolean;
  turns: number;
}

export type DiceValue = 1 | 2 | 3 | 4 | 5 | 6;

export interface Dice {
  id: number;
  value: DiceValue;
  selected: boolean;
  selectable: boolean;
  scored: boolean;
}