import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, FormsModule],
  template: `
    <div class="card">
      <div class="card__logo">
        <h1>Lean Convo</h1>
        <p>Sign in to manage your sessions</p>
      </div>

      @if (errorMessage()) {
        <div class="alert alert-error" role="alert">
          {{ errorMessage() }}
        </div>
      }

      <form (ngSubmit)="onSubmit()" #loginForm="ngForm" novalidate>
        <div class="form-group">
          <label for="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            [(ngModel)]="email"
            placeholder="jane@example.com"
            required
            #emailInput="ngModel"
            autocomplete="email"
          />
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            [(ngModel)]="password"
            placeholder="••••••••"
            required
            #passwordInput="ngModel"
            autocomplete="current-password"
          />
        </div>

        <button type="submit" class="btn btn-primary" [disabled]="loading() || loginForm.invalid">
          {{ loading() ? 'Signing in...' : 'Sign In' }}
        </button>
      </form>

      <div class="card__footer">
        Don't have an account? <a routerLink="/register">Create one</a>
      </div>
      <div class="card__footer" style="margin-top:0.75rem;">
        <a routerLink="/" style="color:var(--text-muted);font-size:0.85rem;">← Back to home</a>
      </div>
    </div>
  `
})
export class LoginComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  email = '';
  password = '';

  loading = signal(false);
  errorMessage = signal<string | null>(null);

  onSubmit(): void {
    if (!this.email || !this.password) {
      this.errorMessage.set('Email and password are required.');
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);

    this.auth.login({ email: this.email, password: this.password }).subscribe({
      next: (res) => {
        this.loading.set(false);
        if (res.success) {
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage.set(res.errorMessage || res.message || 'Invalid email or password.');
        }
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set('Network error. Please check your connection and try again.');
      }
    });
  }
}
