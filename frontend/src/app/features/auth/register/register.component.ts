import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, FormsModule],
  template: `
    <div class="card">
      <div class="card__logo">
        <h1>Lean Convo</h1>
        <p>Create your organizer account</p>
      </div>

      @if (errorMessage()) {
        <div class="alert alert-error" role="alert">
          {{ errorMessage() }}
        </div>
      }

      @if (successMessage()) {
        <div class="alert alert-success" role="alert">
          {{ successMessage() }}
        </div>
      }

      <form (ngSubmit)="onSubmit()" #registerForm="ngForm" novalidate>
        <div class="form-group">
          <label for="displayName">Display Name</label>
          <input
            type="text"
            id="displayName"
            name="displayName"
            [(ngModel)]="displayName"
            placeholder="Jane Smith"
            required
            #nameInput="ngModel"
            autocomplete="name"
          />
        </div>

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
          <label for="password">Password <span style="font-weight:400;color:var(--text-muted)">(min 8 chars)</span></label>
          <input
            type="password"
            id="password"
            name="password"
            [(ngModel)]="password"
            placeholder="••••••••"
            required
            minlength="8"
            #passwordInput="ngModel"
            autocomplete="new-password"
          />
        </div>

        <button type="submit" class="btn btn-primary" [disabled]="loading() || registerForm.invalid">
          {{ loading() ? 'Creating account...' : 'Create Account' }}
        </button>
      </form>

      <div class="card__footer">
        Already have an account? <a routerLink="/login">Sign in</a>
      </div>
      <div class="card__footer" style="margin-top:0.75rem;">
        <a routerLink="/" style="color:var(--text-muted);font-size:0.85rem;">← Back to home</a>
      </div>
    </div>
  `
})
export class RegisterComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  displayName = '';
  email = '';
  password = '';

  loading = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  onSubmit(): void {
    if (!this.displayName || !this.email || !this.password) {
      this.errorMessage.set('All fields are required.');
      return;
    }

    if (this.password.length < 8) {
      this.errorMessage.set('Password must be at least 8 characters.');
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    this.auth.register({ displayName: this.displayName, email: this.email, password: this.password }).subscribe({
      next: (res) => {
        this.loading.set(false);
        if (res.success) {
          this.successMessage.set('Account created! Redirecting to login...');
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1500);
        } else {
          this.errorMessage.set(res.errorMessage || res.message || 'Registration failed. Please try again.');
        }
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set('Network error. User email may already be in use.');
      }
    });
  }
}
