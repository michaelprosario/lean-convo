import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SessionService } from '../../../core/services/session.service';

@Component({
  selector: 'app-create-session',
  standalone: true,
  imports: [RouterLink, FormsModule],
  template: `
    <div class="create-session-container">
      <a routerLink="/dashboard" class="back-link">← Back to dashboard</a>
      
      <div class="card" style="max-width: 100%;">
        <div class="card__logo">
          <h1>Lean Convo</h1>
          <p>Create a new session</p>
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

        <form (ngSubmit)="onSubmit()" #sessionForm="ngForm" novalidate>
          <div class="form-group">
            <label for="title">Session Title <span style="color:#ef4444">*</span></label>
            <input
              type="text"
              id="title"
              name="title"
              [(ngModel)]="title"
              placeholder="e.g. Team Retrospective Q3"
              required
              #titleInput="ngModel"
            />
          </div>

          <div class="form-group">
            <label for="description">Description</label>
            <textarea
              id="description"
              name="description"
              [(ngModel)]="description"
              placeholder="Optional – describe the purpose of this session"
              rows="3"
            ></textarea>
          </div>

          <div class="form-group">
            <label for="videoLink">Video Call Link</label>
            <input
              type="url"
              id="videoLink"
              name="videoLink"
              [(ngModel)]="videoLink"
              placeholder="https://zoom.us/j/..."
            />
            <p class="hint">Zoom, Teams, Meet, etc. Shared with participants.</p>
          </div>

          <div class="form-group">
            <label for="maxUpvotesPerParticipant">Max Up-votes per Participant <span style="color:#ef4444">*</span></label>
            <input
              type="number"
              id="maxUpvotesPerParticipant"
              name="maxUpvotesPerParticipant"
              [(ngModel)]="maxUpvotesPerParticipant"
              min="1"
              max="20"
              required
              #votesInput="ngModel"
            />
            <p class="hint">How many topics each participant may vote for.</p>
          </div>

          <button type="submit" class="btn btn-primary" [disabled]="loading() || sessionForm.invalid">
            {{ loading() ? 'Creating...' : 'Create Session' }}
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    :host {
      width: 100%;
      max-width: 520px;
      margin: 0 auto;
      display: block;
    }
    .create-session-container {
      width: 100%;
    }
    .back-link {
      display: inline-block;
      margin-bottom: 1.5rem;
      color: var(--text-muted);
      font-size: 0.9rem;
      transition: color 0.2s;
      &:hover {
        color: var(--accent-primary);
        text-decoration: none;
      }
    }
    .hint {
      font-size: 0.78rem;
      color: var(--text-muted);
      margin-top: 0.2rem;
    }
  `]
})
export class CreateSessionComponent {
  private readonly sessionService = inject(SessionService);
  private readonly router = inject(Router);

  title = '';
  description = '';
  videoLink = '';
  maxUpvotesPerParticipant = 3;

  loading = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  onSubmit(): void {
    if (!this.title) {
      this.errorMessage.set('Session title is required.');
      return;
    }

    if (this.maxUpvotesPerParticipant < 1) {
      this.errorMessage.set('Max up-votes per participant must be at least 1.');
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    const payload = {
      title: this.title,
      description: this.description || undefined,
      videoLink: this.videoLink || undefined,
      maxUpvotesPerParticipant: this.maxUpvotesPerParticipant
    };

    this.sessionService.createSession(payload).subscribe({
      next: (res) => {
        this.loading.set(false);
        if (res.success && res.data) {
          this.successMessage.set(`Session created! Join code: ${res.data.joinCode}`);
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 2500);
        } else {
          this.errorMessage.set(res.errorMessage || res.message || 'Failed to create session.');
        }
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set('Network error. Failed to create session.');
      }
    });
  }
}
