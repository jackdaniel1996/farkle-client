export interface Lobby {
    lobbyId: string;
    lobbyName: string;
    players: Player[];
    status: 'waiting' | 'playing' | 'finished';
}

export interface Player {
    id: string;
    socketId: string;
    username: string;
    connected?: boolean
}