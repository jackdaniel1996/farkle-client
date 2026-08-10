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
    socketId: string;
    username: string;
    connected?: boolean
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
                    const {lobby, player} = response;
                    console.log('Lobby created:', response, lobby, player); 

                    this.activeLobby.set(lobby);
                    this.player.set(player);
                    localStorage.setItem('playerId', player.id);

                    this.joinLobby(lobby.lobbyId, player.id, username, password);

                    resolve();              
                }, error: (error) => {
                    console.error('Error creating lobby:', error);
                    reject(error);
                }
            });
        })
    }

    async joinLobby(lobbyId: string, id: string | undefined, username: string, password: string) {
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

            // new user joined
            if(id === undefined && this.player() === null) {
                this.socketService.onLobbyJoined(player => {
                    this.player.set({
                        id: player.id,
                        socketId: player.socketId,
                        username: player.username,
                        connected: true,
                    })                
                    console.log('newUser:', this.player(), player.id)
                    localStorage.setItem('playerId', player.id);
                })
            }

            // try savedPlayerId when joining to reconnect
            const savedPlayerId = localStorage.getItem('playerId') ?? undefined;

            this.socketService.joinLobby(
                lobbyId,
                username,
                password,
                socket.id,
                id ? id : savedPlayerId,
            );
        }

    }
}
