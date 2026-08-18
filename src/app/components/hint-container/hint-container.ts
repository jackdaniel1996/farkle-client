import { Component, computed, Input } from '@angular/core';
import { GameState } from '../../shared/models';
import { LobbyService } from '../../services/lobby.service';

@Component({
  selector: 'app-hint-container',
  imports: [],
  templateUrl: './hint-container.html',
  styleUrl: './hint-container.scss',
})
export class HintContainer {
  constructor(
    private lobbyService: LobbyService,
  ) {}

  game = computed(() => {
    return this.lobbyService.activeLobby()?.game;
  });

  activePlayer = computed(() => {
    const game = this.game();
    if (!game) return undefined;
    return game.players?.find(p => p.id == game.currentPlayerId);
  });

  selectableDice = computed(() => {
    const diceValues = this.game()?.dice.filter((d) => d.selectable && !d.scored).map((d) => d.value);
    const sorted = diceValues?.sort((a, b) =>  a - b);
    return sorted?.join('-') ?? '';
  })
}
