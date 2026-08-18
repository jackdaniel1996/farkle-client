import { Component, OnInit, signal } from '@angular/core';
import { LobbyService} from '../../services/lobby.service';
import { GameContainer } from "../game-container/game-container";
import { SocketService } from '../../services/socket.service';
import { Router } from '@angular/router';
import { Lobby } from '../../shared/models';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-lobby',
  imports: [GameContainer, FormsModule],
  templateUrl: './lobby.html',
  styleUrl: './lobby.scss',
})
export class LobbyComponent implements OnInit {
  maxPoints = signal<number>(10000);

  constructor(
    public lobbyService: LobbyService,
    private socketService: SocketService,
    private router: Router,
  ) {

  }

  ngOnInit() {
    this.socketService.onReceiveTask('gameStarted', (lobby: Lobby) => {
      this.router.navigate(['/game']);
      this.lobbyService.activeLobby.update((current) => {
        return {
            ...current,            
            lobbyId: lobby.lobbyId,
            lobbyName: lobby.lobbyName,
            players: lobby.players,
            status: lobby.status,
            game: lobby.game,
        }
      });
      console.log('startGame', this.lobbyService.activeLobby())
    });
  }

  startGame() {
    const lobby = this.lobbyService.activeLobby();
    if(lobby) {
      this.lobbyService.startGame(lobby.lobbyId, this.maxPoints())
    }
  }
}
