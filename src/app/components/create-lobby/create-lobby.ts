import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { LobbyService } from '../../services/lobby.service';
import { LoadingSpinner } from '../loading-spinner/loading-spinner';

@Component({
  selector: 'app-create-lobby',
  imports: [
    CommonModule,
    FormsModule,
    LoadingSpinner
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

  error = signal<boolean>(false);
  loading = signal<boolean>(false);

  createLobby() {
    if (!this.lobbyName.trim() || !this.username.trim() || !this.password.trim()) {
      this.error.set(true);
      return;
    }
    this.error.set(false);
    this.loading.set(true);
    this.lobbyService.createLobby(this.lobbyName, this.username, this.password).then(() => {
      this.loading.set(false);
    });
  }

  joinLobby() {
    if (!this.lobbyId.trim() || !this.username.trim() || !this.password.trim()) {
      this.error.set(true);
      return;
    }
    this.error.set(false);
    this.lobbyService.joinLobby(this.lobbyId, undefined, this.username, this.password);
  }
}
