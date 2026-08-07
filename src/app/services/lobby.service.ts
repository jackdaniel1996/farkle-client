import { Service, signal } from '@angular/core';

export interface Lobby {
    lobbyId: string;
    lobbyName: string;
    players: Player[];
}

export interface Player {
    id: string;
    username: string;
}

@Service()
export class LobbyService {
    constructor() {}
    activeLobby = signal<Lobby | null>(null);
}
