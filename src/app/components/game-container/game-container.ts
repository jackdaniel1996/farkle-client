import { Component, Input, input } from '@angular/core';
import { PlayerList } from '../player-list/player-list';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-game-container',
  imports: [PlayerList, CommonModule],
  templateUrl: './game-container.html',
  styleUrl: './game-container.scss',
})
export class GameContainer {
  @Input() showPlayerList: boolean = false;
  @Input() showScoreboard: boolean = false;
}
