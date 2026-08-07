import { Component } from '@angular/core';
import { CreateLobby } from "../create-lobby/create-lobby";
import { LobbyService } from '../../services/lobby.service';
import { Lobby } from '../lobby/lobby';

@Component({
  selector: 'app-home',
  imports: [
    CreateLobby,
    Lobby,
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  constructor(
    public lobbyService: LobbyService,
  ) {}
}
