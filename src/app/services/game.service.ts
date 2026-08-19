import { Injectable } from "@angular/core";
import { SocketService } from "./socket.service";
import { Dice } from "../shared/models";

@Injectable({
  providedIn: 'root'
})
export class GameService {
    constructor(
        private socketService: SocketService,
    ) {}

    rollDice(lobbyId: string) {
        this.socketService.onSendTask('rollDice', {lobbyId});
    }

    selectDice(lobbyId: string, diceId: number) {
        this.socketService.onSendTask('selectDice', {lobbyId, diceId});
    }

    unselectDice(lobbyId: string, diceId: number) {
        this.socketService.onSendTask('unselectDice', {lobbyId, diceId});
    }

    scoreDice(lobbyId: string) {
        this.socketService.onSendTask('scoreDice', {lobbyId});
    }

    endTurn(lobbyId: string) {
        this.socketService.onSendTask('endTurn', {lobbyId});
    }

    restartGame(lobbyId: string) {
        this.socketService.onSendTask('restartGame', {lobbyId});
    }
}