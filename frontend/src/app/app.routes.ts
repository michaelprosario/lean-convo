import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { participantGuard } from './core/guards/participant.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/splash/splash.component').then(m => m.SplashComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'join',
    loadComponent: () => import('./features/join/join.component').then(m => m.JoinComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'create-session',
    loadComponent: () => import('./features/sessions/create-session/create-session.component').then(m => m.CreateSessionComponent),
    canActivate: [authGuard]
  },
  {
    path: 'organizer-session',
    loadComponent: () => import('./features/sessions/organizer-session/organizer-session.component').then(m => m.OrganizerSessionComponent),
    canActivate: [authGuard]
  },
  {
    path: 'session',
    loadComponent: () => import('./features/sessions/participant-session/participant-session.component').then(m => m.ParticipantSessionComponent),
    canActivate: [participantGuard]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
