import { Component } from '@angular/core';
import { LobbyService} from '../../services/lobby.service';
import { GameContainer } from "../game-container/game-container";

@Component({
  selector: 'app-lobby',
  imports: [GameContainer],
  templateUrl: './lobby.html',
  styleUrl: './lobby.scss',
})
export class LobbyComponent {

  constructor(
    public lobbyService: LobbyService,
  ) {

  }

  startGame() {
    const lobby = this.lobbyService.activeLobby();
    if(lobby) {
      this.lobbyService.startGame(lobby.lobbyId)
    }
  }
}
