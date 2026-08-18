import { Component, computed, Input } from '@angular/core';
import { GameState } from '../../shared/models';

@Component({
  selector: 'app-hint-container',
  imports: [],
  templateUrl: './hint-container.html',
  styleUrl: './hint-container.scss',
})
export class HintContainer {
  @Input() game: GameState | undefined = undefined;

  activePlayer = computed(() => {
    const game = this.game;
    if (!game) return undefined;
    return game.players?.find(p => p.id == game.currentPlayerId);
  });
}
