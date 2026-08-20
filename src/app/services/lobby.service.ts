import { Injectable, signal } from '@angular/core';
import { ApiService } from './api.service';
import { SocketService } from './socket.service';
import { Router } from '@angular/router';
import { GameState, Lobby, Player, SavedLobbyDetails, SocketResponse } from '../shared/models';

@Injectable({
  providedIn: 'root'
})
export class LobbyService {
    constructor(
        private apiService: ApiService,
        private socketService: SocketService,
        private router: Router,
    ) {}
    
    errorMessage = signal<string>('');
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
                    localStorage.setItem('lobbyDetails', JSON.stringify({
                        playerId: player.id,
                        username: player.username,
                        lobbyId: lobby.lobbyId,
                        password: password
                    }));

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

        // try savedPlayerId when joining to reconnect
        const savedLobbyDetails: SavedLobbyDetails | undefined = JSON.parse(localStorage.getItem('lobbyDetails') ?? 'null') ?? undefined;
        const savedPlayerId = savedLobbyDetails?.playerId ?? undefined;

        const socket = this.socketService.socket;
        if (socket?.id) {
            console.log('socket', socket, lobbyId)

            // user joined
            this.socketService.onReceiveTask("joinedLobby", player => {
                this.player.set({
                    id: player.id,
                    socketId: player.socketId,
                    username: player.username,
                    connected: true,
                })
                console.log('game-joined', this.activeLobby(), id ? id : savedPlayerId, this.activeLobby()?.status == 'waiting' )
                if((id ? id : savedPlayerId) === undefined || this.activeLobby()?.status == 'waiting') {
                    // new player
                    this.router.navigate(['/lobby']);

                    localStorage.setItem('lobbyDetails', JSON.stringify({
                        playerId: player.id,
                        lobbyId:  this.activeLobby()?.lobbyId ?? undefined,
                        password: password
                    }));
                } else {
                    this.router.navigate(['/game']);
                }

            });

            this.socketService.onSendTask("joinLobby", {
                lobbyId,
                username,
                password,
                socketId: socket.id,
                id: id ? id : savedPlayerId,
            }, (response: SocketResponse) => {
                if (!response.success) {
                    console.error(response.error);
                    this.errorMessage.set(response.error ?? "Fehler beim beitreten der Lobby");
                    return;
                } else {
                    this.errorMessage.set('');
                }

                console.log('-------Joined', username)
            })
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

    startGame(lobbyId: string, maxPoints: number) {  
        this.socketService.onSendTask('startGame', {lobbyId, maxPoints}, (response: SocketResponse) => {
                if (!response.success) {
                    console.error(response.error);
                    this.errorMessage.set(response.error ?? "Fehler beim starten des Spiels");
                    return;
                } else {
                    this.errorMessage.set('');
                }
            }
        );
    }

    // rejoin after reload if possible
    rejoinLobby() {
        if(this.activeLobby() === null) {
            const storedLobbyDetails = localStorage.getItem('lobbyDetails');
            if (!storedLobbyDetails) {
                return;
            }
    
            const lobbyDetails: SavedLobbyDetails = JSON.parse(storedLobbyDetails);
            this.joinLobby(
                lobbyDetails.lobbyId,
                lobbyDetails.playerId,
                lobbyDetails.username,
                lobbyDetails.password,
            );
        }
    }
}
