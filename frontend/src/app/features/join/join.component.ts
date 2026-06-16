import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SessionService } from '../../core/services/session.service';
import { ParticipantService } from '../../core/services/participant.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-join',
  standalone: true,
  imports: [RouterLink, FormsModule],
  template: `
    <div class="card">
      <div class="card__logo">
        <h1>Lean Convo</h1>
        <p>Join a session</p>
      </div>

      @if (errorMessage()) {
        <div class="alert alert-error" role="alert">
          {{ errorMessage() }}
        </div>
      }

      <form (ngSubmit)="onSubmit()" #joinForm="ngForm" novalidate>
        <div class="form-group">
          <label for="joinCode">Session Code <span style="color:#ef4444">*</span></label>
          <input
            type="text"
            id="joinCode"
            name="joinCode"
            [(ngModel)]="joinCode"
            class="code-input"
            placeholder="e.g. A1B2C3"
            maxlength="8"
            required
            autocomplete="off"
            (input)="onCodeInput()"
          />
          <p class="hint">The 6-character code shared by the organizer.</p>
        </div>

        <div class="form-group">
          <label for="name">Your Display Name <span style="color:#ef4444">*</span></label>
          <input
            type="text"
            id="name"
            name="name"
            [(ngModel)]="name"
            placeholder="e.g. Jane Smith"
            required
            autocomplete="name"
          />
        </div>

        <div class="form-group">
          <label for="linkedInUrl">LinkedIn Profile <span style="color:var(--text-muted);font-weight:400">(optional)</span></label>
          <input
            type="url"
            id="linkedInUrl"
            name="linkedInUrl"
            [(ngModel)]="linkedInUrl"
            placeholder="https://linkedin.com/in/..."
          />
        </div>

        <button type="submit" class="btn btn-primary" [disabled]="loading() || joinForm.invalid">
          {{ loading() ? 'Joining...' : 'Join Session' }}
        </button>
      </form>

      <div class="divider-row">or</div>
      <p class="footer-msg">
        @if (auth.isAuthenticated()) {
          Back to <a routerLink="/dashboard">your dashboard</a>
        } @else {
          Are you an organizer? <a routerLink="/login">Sign in</a>
        }
      </p>
    </div>
  `,
  styles: [`
    .hint {
      font-size: 0.78rem;
      color: var(--text-muted);
      margin-top: 0.2rem;
    }
    .code-input {
      text-transform: uppercase;
      letter-spacing: 0.15em;
      font-weight: 700;
      font-size: 1.1rem;
    }
    .divider-row {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin: 1.5rem 0 1rem;
      color: var(--text-muted);
      font-size: 0.8rem;
      text-transform: uppercase;
      font-weight: 500;
      letter-spacing: 0.05em;
      &::before, &::after {
        content: '';
        flex: 1;
        height: 1px;
        background: rgba(255, 255, 255, 0.08);
      }
    }
    .footer-msg {
      text-align: center;
      font-size: 0.9rem;
      color: var(--text-muted);
    }
  `]
})
export class JoinComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly sessionService = inject(SessionService);
  private readonly participantService = inject(ParticipantService);
  readonly auth = inject(AuthService);

  joinCode = '';
  name = '';
  linkedInUrl = '';

  loading = signal(false);
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    if (this.auth.isAuthenticated() && !this.name) {
      this.name = this.auth.displayName();
    }

    this.route.queryParams.subscribe(params => {
      if (params['code']) {
        this.joinCode = params['code'].toUpperCase();
      }
    });
  }

  onCodeInput(): void {
    this.joinCode = this.joinCode.toUpperCase();
  }

  onSubmit(): void {
    if (!this.joinCode || !this.name) {
      this.errorMessage.set('Session code and name are required.');
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);

    this.sessionService.getSessionByCode(this.joinCode).subscribe({
      next: (sessionRes) => {
        if (!sessionRes.success || !sessionRes.data) {
          this.loading.set(false);
          this.errorMessage.set(sessionRes.errorMessage || 'Session not found. Please check the code.');
          return;
        }

        const session = sessionRes.data;

        this.participantService.joinSession({
          joinCode: this.joinCode,
          name: this.name,
          linkedInUrl: this.linkedInUrl || undefined
        }).subscribe({
          next: (joinRes) => {
            this.loading.set(false);
            if (joinRes.success && joinRes.data) {
              const participant = joinRes.data;

              sessionStorage.setItem('participantId', participant.id);
              sessionStorage.setItem('participantName', participant.name);
              sessionStorage.setItem('sessionId', session.id);
              sessionStorage.setItem('sessionTitle', session.title);
              sessionStorage.setItem('joinCode', session.joinCode || this.joinCode);
              sessionStorage.setItem('sessionDescription', session.description || '');
              sessionStorage.setItem('sessionVideoLink', session.videoLink || '');
              sessionStorage.setItem('maxUpvotes', String(session.maxUpvotesPerParticipant));

              this.router.navigate(['/session']);
            } else {
              this.errorMessage.set(joinRes.errorMessage || 'Could not join session. Please try again.');
            }
          },
          error: (err) => {
            this.loading.set(false);
            this.errorMessage.set('Failed to join the session. Please check your inputs.');
          }
        });
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set('Session not found or server error.');
      }
    });
  }
}
