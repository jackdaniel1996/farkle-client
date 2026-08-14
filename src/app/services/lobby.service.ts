import { Injectable, signal } from '@angular/core';
import { ApiService } from './api.service';
import { SocketService } from './socket.service';
import { Router } from '@angular/router';
import { GameState, Lobby, Player } from '../shared/models';

@Injectable({
  providedIn: 'root'
})
export class LobbyService {
    constructor(
        private apiService: ApiService,
        private socketService: SocketService,
        private router: Router,
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
        this.socketService.onReceiveTask("lobbyUpdated", lobby => {
            this.updateLobby(lobby);
        });

        const socket = this.socketService.socket;
        if (socket?.id) {
            console.log('socket', socket, lobbyId)

            // user joined
            this.socketService.onReceiveTask("joinedLobby", player => {
                if(id === undefined && this.player() === null) {
                    // new player
                    this.player.set({
                        id: player.id,
                        socketId: player.socketId,
                        username: player.username,
                        connected: true,
                    })                
                    localStorage.setItem('playerId', player.id);
                }

                this.router.navigate(['/lobby']);
            });

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

    updateLobby(lobby: Lobby) {
        this.activeLobby.update((current) => {
            return {
                ...current,            
                lobbyId: lobby.lobbyId,
                lobbyName: lobby.lobbyName,
                players: lobby.players,
                status: lobby.status,
                game: lobby.game,
            }
        });
        console.log('update lobby', this.activeLobby())
    }

    updateGamestate(gameState: GameState) {
        this.activeLobby.update((current) => {
            if (current === null) return null;
            return {
                ...current,            
                game: gameState,
            }
        });
        console.log('update gamestate', this.activeLobby())
    }

    startGame(lobbyId: string) {  
        this.socketService.onSendTask('startGame', {lobbyId})
    }
}
