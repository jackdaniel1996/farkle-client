import { Component } from '@angular/core';
import { CreateLobby } from "../create-lobby/create-lobby";
import { GameContainer } from "../game-container/game-container";

@Component({
  selector: 'app-home',
  imports: [
    CreateLobby,
    GameContainer
],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
}
