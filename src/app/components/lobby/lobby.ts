import { Component, computed } from '@angular/core';
import { LobbyService, Player } from '../../services/lobby.service';
import { SocketService } from '../../services/socket.service';

@Component({
  selector: 'app-lobby',
  imports: [],
  templateUrl: './lobby.html',
  styleUrl: './lobby.scss',
})
export class LobbyComponent {
  lobbyPlayers = computed<Player[]>(() => {
    const lobby = this.lobbyService.activeLobby();
    if(!lobby) return [];
    const connectedPlayers = lobby.players.filter((p: Player) => p.connected)
    return connectedPlayers;
  })

  constructor(
    public lobbyService: LobbyService,
    private socketService: SocketService,
  ) {

  }
}
