import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-splash',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="splash">
      <div class="splash__logo">
        <h1 class="app-name">Lean Convo</h1>
        <p class="app-tagline">Facilitate lean, focused conversations with structured sessions.</p>
      </div>

      <div class="splash__features">
        <div class="feature-item">✓ Create and manage conversation sessions</div>
        <div class="feature-item">✓ Invite participants and track outcomes</div>
        <div class="feature-item">✓ Keep meetings lean and on-topic</div>
      </div>

      <div class="splash__card card">
        <h2>Get started today</h2>
        <div class="splash__actions">
          <a routerLink="/register" class="btn btn-primary">Create an Account</a>
          <div class="divider">or</div>
          <a routerLink="/login" class="btn btn-outline">Sign In</a>
          <div class="divider">or</div>
          <a routerLink="/join" class="btn btn-outline join-btn">Join a Session</a>
        </div>
      </div>

      <p class="splash__footer">
        Already have an account? <a routerLink="/login">Sign in here.</a>
      </p>
    </div>
  `,
  styles: [`
    :host {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 80vh;
      width: 100%;
    }
    .splash {
      max-width: 480px;
      width: 100%;
      text-align: center;
    }
    .splash__logo {
      margin-bottom: 2rem;
    }
    .app-name {
      font-size: 3rem;
      background: linear-gradient(to right, #818cf8, #6366f1, #3b82f6);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-weight: 800;
      letter-spacing: -1px;
    }
    .app-tagline {
      font-size: 1.1rem;
      color: var(--text-muted);
      margin-top: 0.5rem;
    }
    .splash__features {
      display: flex;
      flex-direction: column;
      gap: 0.6rem;
      margin-bottom: 2.5rem;
      align-items: center;
    }
    .feature-item {
      font-size: 0.95rem;
      color: rgba(248, 250, 252, 0.85);
    }
    .splash__card {
      h2 {
        font-size: 1.25rem;
        margin-bottom: 1.5rem;
      }
    }
    .splash__actions {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .divider {
      font-size: 0.8rem;
      color: #4b5563;
      text-transform: uppercase;
      font-weight: 500;
      letter-spacing: 0.05em;
    }
    .join-btn {
      border-color: #38bdf8;
      color: #38bdf8;
      &:hover {
        background: rgba(56, 189, 248, 0.05);
        border-color: #0ea5e9;
        color: #0ea5e9;
      }
    }
    .splash__footer {
      margin-top: 1.5rem;
      font-size: 0.85rem;
      color: var(--text-muted);
    }
  `]
})
export class SplashComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  ngOnInit(): void {
    if (this.auth.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }
}
