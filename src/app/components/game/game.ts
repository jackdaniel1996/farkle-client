import { Component } from '@angular/core';
import { GameContainer } from "../game-container/game-container";

@Component({
  selector: 'app-game',
  imports: [GameContainer],
  templateUrl: './game.html',
  styleUrl: './game.scss',
})
export class Game {}
