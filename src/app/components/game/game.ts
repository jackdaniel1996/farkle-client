import { Component, computed, effect, OnInit, signal, untracked } from '@angular/core';
import { GameContainer } from "../game-container/game-container";
import { LobbyService } from '../../services/lobby.service';
import { DiceComponent } from '../dice/dice';
import { GameService } from '../../services/game.service';
import { Lobby } from '../../shared/models';
import { SocketService } from '../../services/socket.service';

@Component({
  selector: 'app-game',
  imports: [GameContainer, DiceComponent],
  templateUrl: './game.html',
  styleUrl: './game.scss',
})
export class Game implements OnInit {
  game = computed(() => {
    console.log('active-lobby', this.lobbyService.activeLobby())
    return this.lobbyService.activeLobby()?.game;
  });
  activePlayer = computed(() => {
    const game = this.game();

    if (!game) return undefined;

    return game.players?.find(p => p.id == game.currentPlayerId);
  });
  selectedDice = computed(() => this.game()?.dice.filter((d) => d.selected));

  rolling = signal<boolean>(false)

  constructor(
    public lobbyService: LobbyService,
    private gameService: GameService,
    private socketService: SocketService,
  ) {
  }

  ngOnInit() {
    this.socketService.onReceiveTask("diceRolled", gameState => {
      this.lobbyService.updateGamestate(gameState);
      this.rolling.set(true);
      setTimeout(() => {this.rolling.set(false)}, 600)
    });

    this.socketService.onReceiveTask("diceSelection", gameState => {
      this.lobbyService.updateGamestate(gameState);
    });
  }

  rollDice() {
    const lobby = this.lobbyService.activeLobby();
    if(lobby) {
      this.gameService.rollDice(lobby.lobbyId);
    }
  }

  onSelectDice(diceId: number) {
    const lobby = this.lobbyService.activeLobby();
    if(lobby) {
      this.gameService.selectDice(lobby.lobbyId, diceId);
    }
  }

  onUnselectDice(diceId: number) {
    const lobby = this.lobbyService.activeLobby();
    if(lobby) {
      this.gameService.unselectDice(lobby.lobbyId, diceId);
    }
  }
}
