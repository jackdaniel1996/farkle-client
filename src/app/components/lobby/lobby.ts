import { Component } from '@angular/core';
import { LobbyService } from '../../services/lobby.service';

@Component({
  selector: 'app-lobby',
  imports: [],
  templateUrl: './lobby.html',
  styleUrl: './lobby.scss',
})
export class Lobby {
  constructor(
    public lobbyService: LobbyService,
  ) {

  }
}
