import { Injectable, signal } from "@angular/core";
import { SocketService } from "./socket.service";
import { Dice, SocketResponse } from "../shared/models";

@Injectable({
  providedIn: 'root'
})
export class GameService {
    errorMessage = signal<string>('');

    constructor(
        private socketService: SocketService,
    ) {}

    rollDice(lobbyId: string) {
        this.socketService.onSendTask('rollDice', {lobbyId}, (response: SocketResponse) => {
                if (!response.success) {
                    console.error(response.error);
                    this.errorMessage.set(response.error ?? "Fehler beim Würfeln");
                    return;
                } else {
                    this.errorMessage.set('');
                }
            }
        );
    }

    selectDice(lobbyId: string, diceId: number) {
        this.socketService.onSendTask('selectDice', {lobbyId, diceId}, (response: SocketResponse) => {
                if (!response.success) {
                    console.error(response.error);
                    this.errorMessage.set(response.error ?? "Fehler beim auswählen des Würfels");
                    return;
                } else {
                    this.errorMessage.set('');
                }
            }
        );
    }

    unselectDice(lobbyId: string, diceId: number) {
        this.socketService.onSendTask('unselectDice', {lobbyId, diceId}, (response: SocketResponse) => {
                if (!response.success) {
                    console.error(response.error);
                    this.errorMessage.set(response.error ?? "Fehler beim abwählen des Würfels");
                    return;
                } else {
                    this.errorMessage.set('');
                }
            }
        );
    }

    scoreDice(lobbyId: string) {
        this.socketService.onSendTask('scoreDice', {lobbyId}, (response: SocketResponse) => {
                if (!response.success) {
                    console.error(response.error);
                    this.errorMessage.set(response.error ?? "Fehler beim werten der Punkte");
                    return;
                } else {
                    this.errorMessage.set('');
                }
            }
        );
    }

    endTurn(lobbyId: string) {
        this.socketService.onSendTask('endTurn', {lobbyId}, (response: SocketResponse) => {
                if (!response.success) {
                    console.error(response.error);
                    this.errorMessage.set(response.error ?? "Fehler beim beenden des Zuges");
                    return;
                } else {
                    this.errorMessage.set('');
                }
            }
        );
    }

    restartGame(lobbyId: string) {
        this.socketService.onSendTask('restartGame', {lobbyId}, (response: SocketResponse) => {
                if (!response.success) {
                    console.error(response.error);
                    this.errorMessage.set(response.error ?? "Fehler beim Neustart des Spiels");
                    return;
                } else {
                    this.errorMessage.set('');
                }
            }
        );
    }
}