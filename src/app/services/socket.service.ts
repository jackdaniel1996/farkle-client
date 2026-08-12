import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../environments/environment';
import { Lobby, Player } from './lobby.service';


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

    onSendTask(task: string, params: {}) {
        this.socket?.emit(task, params);
    }
    
    onReceiveTask(task: string, callback: (param: any) => void) {
        this.socket?.on(task, callback);
    }
}