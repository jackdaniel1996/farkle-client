import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { LobbyComponent } from './components/lobby/lobby';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'lobby', component: LobbyComponent },
    { path: '**', redirectTo: '' }, // Fallback-Route auf /home
];
