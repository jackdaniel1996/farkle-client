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
  selectedDiceIds = signal<number[]>([]);

  constructor(
    public lobbyService: LobbyService,
    private gameService: GameService,
    private socketService: SocketService,
  ) {
  }

  ngOnInit() {
    this.socketService.onReceiveTask("diceRolled", lobby => {
      this.lobbyService.updateLobby(lobby);
      this.rolling.set(true);
      setTimeout(() => {this.rolling.set(false)}, 600)
    });
  }

  rollDice() {
    const lobby = this.lobbyService.activeLobby();
    if(lobby) {
      this.gameService.rollDice(lobby.lobbyId);
    }
  }

  onClickDice(diceId: number) {
    if(this.selectedDiceIds().includes(diceId)){
      this.selectedDiceIds.update((current) => current.filter(c => c !== diceId))
    } else {
      this.selectedDiceIds.update((current) => [...current, diceId])
    }
  }
}
