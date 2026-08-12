import { Component, computed } from '@angular/core';
import { LobbyService, Player } from '../../services/lobby.service';

@Component({
  selector: 'app-player-list',
  imports: [],
  templateUrl: './player-list.html',
  styleUrl: './player-list.scss',
})
export class PlayerList {
  lobbyPlayers = computed<Player[]>(() => {
    const lobby = this.lobbyService.activeLobby();
    if(!lobby) return [];
    const connectedPlayers = lobby.players.filter((p: Player) => p.connected)
    return connectedPlayers;
  })

  constructor(
    public lobbyService: LobbyService,
  ) {

  }
}
