import { Injectable, signal } from '@angular/core';
import { ApiService } from './api.service';
import { SocketService } from './socket.service';

export interface Lobby {
    lobbyId: string;
    lobbyName: string;
    players: Player[];
}

export interface Player {
    id: string;
    username: string;
}

@Injectable({
  providedIn: 'root'
})
export class LobbyService {
    constructor(
        private apiService: ApiService,
        private socketService: SocketService,
    ) {}

    activeLobby = signal<Lobby | null>(null);
    player = signal<Player | null>(null);

    createLobby(lobbyName: string, username: string, password: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.apiService.call('/lobby/create', {
            lobbyName: lobbyName,
            username: username,
            password: password,
            }, "post").subscribe({
                next: (response: {lobby: Lobby, player: Player}) => {                    
                    console.log('Lobby created:', response);
                    this.activeLobby.set(response.lobby);
                    this.player.set(response.player);

                    this.joinLobby(response.lobby.lobbyId, username, password);

                    resolve();              
                }, error: (error) => {
                    console.error('Error creating lobby:', error);
                    reject(error);
                }
            });
        })
    }

    async joinLobby(lobbyId: string, username: string, password: string) {
        // connect socket and join lobby after lobby creation
        await this.socketService.connect();
        this.socketService.onLobbyUpdated(lobby => {
            this.activeLobby.update((current) => {
                return {
                    ...current,            
                    lobbyId: lobby.lobbyId,
                    lobbyName: lobby.lobbyName,
                    players: lobby.players
                }
            });
            console.log('update lobby', this.activeLobby())
        });

        const socket = this.socketService.socket;
        if (socket?.id) {
            console.log('socket', socket, lobbyId)
            this.socketService.joinLobby(
                lobbyId,
                username,
                password,
                socket.id
            );
        }
    }
}
