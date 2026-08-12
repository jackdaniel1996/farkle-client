import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { LobbyComponent } from './components/lobby/lobby';
import { Game } from './components/game/game';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'lobby', component: LobbyComponent },
    { path: 'game', component: Game },
    { path: '**', redirectTo: '' }, // Fallback-Route auf /home
];
