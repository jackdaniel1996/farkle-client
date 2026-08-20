import { Component, Input, input, viewChild } from '@angular/core';
import { PlayerList } from '../player-list/player-list';
import { CommonModule } from '@angular/common';
import { OverlayComponent } from '../overlay-component/overlay-component';
import { Rules } from '../rules/rules';
import { LobbyService } from '../../services/lobby.service';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-game-container',
  imports: [PlayerList, CommonModule, OverlayComponent],
  templateUrl: './game-container.html',
  styleUrl: './game-container.scss',
})
export class GameContainer {
  @Input() showPlayerList: boolean = false;
  @Input() showScoreboard: boolean = false;

  overlay = viewChild.required(OverlayComponent);

  openGameRules() {
    this.overlay().open(Rules);    
  }
  
  constructor(
    public lobbyService: LobbyService,
    public gameService: GameService,
  ) {

  }
}
