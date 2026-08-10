import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../environments/environment';
import { Lobby } from './lobby.service';


@Injectable({
    providedIn: 'root'
})
export class SocketService {
   public socket?: Socket;

    connect() {
        return new Promise<void>((resolve, reject) => {
            this.socket = io(environment.apiEndpoint);
    
            this.socket.on("connect", () => {
                console.log("Verbunden:", this.socket?.id);
                resolve()
            });
        });
    }

    disconnect() {
        this.socket?.disconnect();
    }

    joinLobby(lobbyId: string, username: string, password: string, socketId: string, id?: string) {
        const params = {
                lobbyId,
                username,
                password,
                socketId,
                id
            }
        this.socket?.emit("joinLobby", params);
    }

    onLobbyUpdated(callback: (lobby: Lobby) => void) {
        this.socket?.on(
            "lobbyUpdated",
            callback
        );
    }
}