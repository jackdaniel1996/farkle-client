import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../environments/environment';
import { SocketResponse } from '../shared/models';


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

    onSendTask(task: string, params: {}, callback?: (response: SocketResponse) => void) {
        this.socket?.emit(task, params, callback);
    }
    
    onReceiveTask(task: string, callback: (param: any) => void) {
        this.socket?.on(task, callback);
    }
}