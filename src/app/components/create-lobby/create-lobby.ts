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
    this.lobbyService.createLobby(this.lobbyName, this.username, this.password);
  }

  joinLobby() {
    this.lobbyService.joinLobby(this.lobbyId, this.username, this.password);
  }
}
