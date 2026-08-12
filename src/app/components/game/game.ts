import { Component, computed } from '@angular/core';
import { GameContainer } from "../game-container/game-container";
import { LobbyService } from '../../services/lobby.service';
import { DiceComponent } from '../dice/dice';

@Component({
  selector: 'app-game',
  imports: [GameContainer, DiceComponent],
  templateUrl: './game.html',
  styleUrl: './game.scss',
})
export class Game {
  game = computed(() => this.lobbyService.activeLobby()?.game);
  activePlayer = computed(() => this.game()?.players.find((p) => p.id == this.game()?.currentPlayerId))
  selectedDice = computed(() => this.game()?.dice.filter((d) => d.selected));

  constructor(private lobbyService: LobbyService) {}
}
