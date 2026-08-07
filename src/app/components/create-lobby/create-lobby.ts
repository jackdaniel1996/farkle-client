import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Lobby, LobbyService } from '../../services/lobby.service';

@Component({
  selector: 'app-create-lobby',
  imports: [
    CommonModule,
    FormsModule,
],
  templateUrl: './create-lobby.html',
  styleUrl: './create-lobby.scss',
})
export class CreateLobby {
  constructor(
    private apiService: ApiService,
    private lobbyService: LobbyService,
  ) {}

  selection = signal<"create" | "join">("create");

  lobbyName: string = '';
  lobbyId: string = '';
  username: string = '';
  password: string = ''; 

  createLobby() {
    this.apiService.call('/lobby/create', {
      lobbyName: this.lobbyName,
      username: this.username,
      password: this.password,
    }, "post").subscribe((response: Lobby) => {
      console.log('Lobby created:', response);
      this.lobbyService.activeLobby.set(response);
    });
  }

  joinLobby() {
    this.apiService.call('/lobby/join', {
      lobbyId: this.lobbyId,
      username: this.username,
      password: this.password,
    }, "post").subscribe((response: Lobby) => {
      console.log('Lobby joined:', response);
      this.lobbyService.activeLobby.set(response);
    });
  }
}
