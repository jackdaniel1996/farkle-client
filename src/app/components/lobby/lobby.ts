import { Component, OnInit } from '@angular/core';
import { Lobby, LobbyService } from '../../services/lobby.service';
import { SocketService } from '../../services/socket.service';

@Component({
  selector: 'app-lobby',
  imports: [],
  templateUrl: './lobby.html',
  styleUrl: './lobby.scss',
})
export class LobbyComponent implements OnInit {
  constructor(
    public lobbyService: LobbyService,
    private socketService: SocketService,
  ) {

  }

  ngOnInit() { 
    // this.socketService.connect();

    // const activeLobby = this.lobbyService.activeLobby();
    // const player = this.lobbyService.player();

    // if(activeLobby && player) {
    //   this.socketService.onLobbyUpdated(lobby => {
    //     this.lobbyService.activeLobby.update((current) => {
    //       return {
    //         ...current,            
    //         lobbyId: lobby.lobbyId,
    //         lobbyName: lobby.lobbyName,
    //         players: lobby.players
    //       }
    //     });
    //     console.log("Lobby aktualisiert", lobby, this.lobbyService.activeLobby());
    //   });

    //   // this.socketService.joinLobby(
    //   //     activeLobby.lobbyId,
    //   //     player.id,
    //   // );
    // }
  }
}
