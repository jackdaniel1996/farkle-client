import { Component, computed, Input } from '@angular/core';
import { LobbyService } from '../../services/lobby.service';
import { Player } from '../../shared/models';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-player-list',
  imports: [CommonModule],
  templateUrl: './player-list.html',
  styleUrl: './player-list.scss',
})
export class PlayerList {
  @Input() showScoreboard: boolean = false;

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
