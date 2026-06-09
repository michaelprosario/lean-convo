# Angular 21 Migration Plan: Lean Convo Frontend

This document outlines the architecture, layout, and implementation steps to migrate the prototype HTML/CSS/JS screens under `backend/public/` into the well-organized, standalone Angular 21 project in `frontend/`.

---

## 1. Project Overview & Architecture

The Angular frontend is built as a modern Single Page Application (SPA). Following **Clean Presentation Layer** principles, it decouples the UI layout from core business rules and API clients by using a structured directory layout.

### Architectural Blueprint (Inward Dependency Flow)
```
┌────────────────────────────────────────────────────────┐
│                        FEATURES                        │
│ (Page components, e.g., Login, Dashboard, live views)  │
└───────────┬─────────────────────────────────┬──────────┘
            │ Depends on                      │ Depends on
            ▼                                 ▼
┌────────────────────────┐        ┌──────────────────────┐
│          CORE          │        │        SHARED        │
│ (Services, Guards,     │        │ (Presentational card,│
│  Types, HTTP Polling)  │        │  buttons, alerts)    │
└────────────────────────┘        └──────────────────────┘
```

- **Core Layer (`src/app/core/`)**: Houses application-wide concerns. Contains services for REST communication, HTTP polling, guards for route security, interceptors, and typed contracts. It has no dependencies on feature components.
- **Feature Layer (`src/app/features/`)**: Standalone page components containing template logic and state orchestration.
- **Shared Layer (`src/app/shared/`)**: Purely presentational components, directives, and pipes that are reusable across features (e.g., cards, error modals, loading spinners).

---

## 2. Directory Layout

The frontend workspace will be organized as follows:

```
frontend/src/app/
├── app.config.ts                 # Application boostrap configuration
├── app.html                      # Root app template containing only <router-outlet />
├── app.scss                      # Global host-level styles
├── app.ts                        # Root AppComponent definition
├── app.routes.ts                 # Route mappings
├── core/                         # Global singleton services, guards, and types
│   ├── guards/
│   │   ├── auth.guard.ts         # Protects organizer routes (JWT check)
│   │   └── participant.guard.ts  # Protects session routes (participant ID check)
│   ├── interceptors/
│   │   └── auth.interceptor.ts   # Automatically attaches JWT token to outbound requests
│   ├── models/
│   │   ├── auth.types.ts
│   │   ├── session.types.ts
│   │   ├── topic.types.ts
│   │   └── participant.types.ts
│   └── services/
│       ├── auth.service.ts       # Handles sign-in, register, sign-out, session storage
│       ├── session.service.ts    # Session crud and CSV/JSON export
│       ├── topic.service.ts      # Topic proposing, editing, upvoting, status updates
│       ├── participant.service.ts# Participant joining
│       └── polling.service.ts    # Service to orchestrate state polling via RxJS timers
├── features/                     # Route components
│   ├── splash/                   # Landing / Splash screen component
│   ├── auth/
│   │   ├── login/                # Sign-in page component
│   │   └── register/             # Create Account page component
│   ├── dashboard/                # Organizer dashboard (list sessions, links)
│   ├── join/                     # Join Session page component (pre-fillable code)
│   └── sessions/
│       ├── create-session/       # Create a new session component
│       ├── organizer-session/    # Organizer session management component
│       └── participant-session/  # Active participant live session component
└── shared/                       # Shared components and utilities
    ├── components/
    │   ├── alert/                # Styled success/error alert widget
    │   ├── spinner/              # Smooth loading animation
    │   └── card/                 # Reusable glassmorphic/flat container
    └── pipes/
```

---

## 3. Core Angular Configuration & Proxy Setup

During local development, the Angular app runs on port `4200` (via `ng serve`), while the NestJS backend runs on port `3001` (configured in `backend/.env`). 

To avoid CORS policy issues and permit relative URL calls (like `fetch('/auth/login')`), a development proxy has been established.

### Proxy Configuration (`frontend/proxy.conf.json`)
The proxy config maps specific API prefixes to the NestJS local server:
```json
{
  "/auth": {
    "target": "http://localhost:3001",
    "secure": false,
    "changeOrigin": true
  },
  "/sessions": {
    "target": "http://localhost:3001",
    "secure": false,
    "changeOrigin": true
  },
  "/topics": {
    "target": "http://localhost:3001",
    "secure": false,
    "changeOrigin": true
  },
  "/participants": {
    "target": "http://localhost:3001",
    "secure": false,
    "changeOrigin": true
  }
}
```

### Wiring into `angular.json`
The proxy is wired into the development server configuration under `serve.options`:
```json
"serve": {
  "builder": "@angular/build:dev-server",
  "options": {
    "proxyConfig": "proxy.conf.json"
  },
  "configurations": {
    "production": {
      "buildTarget": "frontend:build:production"
    },
    "development": {
      "buildTarget": "frontend:build:development"
    }
  },
  "defaultConfiguration": "development"
}
```

---

## 4. Routing Definition (`app.routes.ts`)

Routes are set up dynamically using Angular's lazy-loading mechanism. Route guards ensure authenticated state checks.

```typescript
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
```

---

## 5. Core Services Design

### 5.1 Authentication Service (`auth.service.ts`)
Tracks identity via Angular Signals. Leverages `inject(HttpClient)` within modern injection contexts.

```typescript
import { inject, Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { LoginCredentials, RegisterData, AuthResponse } from '../models/auth.types';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  // Signals for state
  private readonly tokenSignal = signal<string | null>(sessionStorage.getItem('accessToken'));
  private readonly userNameSignal = signal<string | null>(sessionStorage.getItem('displayName'));

  readonly isAuthenticated = computed(() => !!this.tokenSignal());
  readonly displayName = computed(() => this.userNameSignal() || 'User');
  readonly token = computed(() => this.tokenSignal());

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>('/auth/login', credentials).pipe(
      tap(res => {
        if (res.success && res.data) {
          sessionStorage.setItem('accessToken', res.data.accessToken);
          sessionStorage.setItem('userId', res.data.userId);
          sessionStorage.setItem('displayName', res.data.displayName);
          sessionStorage.setItem('email', res.data.email);

          this.tokenSignal.set(res.data.accessToken);
          this.userNameSignal.set(res.data.displayName);
        }
      })
    );
  }

  register(data: RegisterData): Observable<any> {
    return this.http.post('/auth/create-account', data);
  }

  logout(): void {
    sessionStorage.clear();
    this.tokenSignal.set(null);
    this.userNameSignal.set(null);
    this.router.navigate(['/']);
  }
}
```

### 5.2 Polling Sync Strategy (`polling.service.ts`)
To keep the application synchronized with the database in real-time, the `PollingService` uses RxJS timers to query the NestJS REST endpoints periodically (e.g., every 10 seconds) and updates reactive Angular Signals which flow into the templates.

```typescript
import { inject, Injectable, signal, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { interval, Subscription, switchMap, startWith } from 'rxjs';
import { Topic } from '../models/topic.types';

@Injectable({ providedIn: 'root' })
export class PollingService implements OnDestroy {
  private readonly http = inject(HttpClient);
  private pollSub: Subscription | null = null;

  // Signals for state binding in components
  readonly topics = signal<Topic[]>([]);
  readonly isPolling = signal(false);

  startPolling(sessionId: string, intervalMs: number = 10000): void {
    this.stopPolling();
    this.isPolling.set(true);

    this.pollSub = interval(intervalMs)
      .pipe(
        startWith(0),
        switchMap(() => this.http.get<{ success: boolean; data: Topic[] }>(`/topics/by-session/${sessionId}`))
      )
      .subscribe({
        next: (res) => {
          if (res.success && res.data) {
            this.topics.set(res.data);
          }
        },
        error: () => this.isPolling.set(false)
      });
  }

  stopPolling(): void {
    if (this.pollSub) {
      this.pollSub.unsubscribe();
      this.pollSub = null;
    }
    this.isPolling.set(false);
  }

  ngOnDestroy(): void {
    this.stopPolling();
  }
}
```

---

## 6. Premium User Interface Design (Aesthetics & UX)

To make the application feel premium and state of the art, we depart from the basic grey bootstrap design of the prototype and implement a beautiful custom styling layer in [styles.scss](file:///workspaces/lean-convo/frontend/src/styles.scss).

### Global Style Tokens
- **Theme**: Cool Glassmorphic Dark Mode with custom colors (vivid indigo, clean blue accents, rich neon status badges, smooth glass cards).
- **Typography**: Outfit or Inter fonts imported from Google Fonts instead of generic browser system sans-serif.
- **Layouts**: Balanced flex/grid frameworks using custom variables.

### Key CSS Variables (`styles.scss` snippet)
```css
:root {
  --bg-app: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #020617 100%);
  --panel-glass: rgba(30, 41, 59, 0.45);
  --border-glass: rgba(255, 255, 255, 0.08);
  --shadow-premium: 0 10px 40px -10px rgba(0, 0, 0, 0.5);

  --accent-primary: #6366f1; /* Indigo */
  --accent-secondary: #0ea5e9; /* Sky Blue */
  --text-main: #f8fafc;
  --text-muted: #94a3b8;
  
  --status-todo: #64748b;
  --status-active: #10b981;
  --status-done: #3b82f6;
}
```

---

## 7. Migration Steps Roadmap

### Phase 1: Foundation Setup
1. Define TS contracts in `src/app/core/models/` mirroring domain entities.
2. Build the global layout variables in `styles.scss` (fonts, backgrounds, gradients, custom cards).

### Phase 3: Services & Routing Integration
1. Write `AuthService` and configure the HTTP Interceptor to attach bearer tokens automatically.
2. Wire up `app.routes.ts` routes, specifying guards.
3. Scaffold components using the Angular CLI (`ng generate component features/...`).

### Phase 4: Auth & Dashboard Feature Migration
1. Move `login.html` and `register.html` markup into Angular standalone components. Apply Signal Forms or reactive validation.
2. Port the dashboard logic to `DashboardComponent`. Use `@for` control flow block to display the session list.

### Phase 5: Live Session Sync Implementation
1. Port participant session views (`session.html`) and organizer controls (`organizer-session.html`).
2. Integrate `PollingService` to run periodic background sync checks and push state changes to Angular signals.
3. Apply micro-animations (transform scale effects, background transitions) when status changes or upvotes occur.
