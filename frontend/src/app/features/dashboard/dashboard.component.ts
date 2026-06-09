import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { SessionService } from '../../core/services/session.service';
import { Session } from '../../core/models/session.types';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, DatePipe],
  template: `
    <div class="dashboard-page">
      <!-- Top bar -->
      <div class="topbar">
        <h1 class="logo-title">Lean Convo</h1>
        <div class="topbar-actions">
          <span class="welcome">Hi, {{ auth.displayName() }}</span>
          <button class="btn btn-outline btn-sm" (click)="auth.logout()">Sign Out</button>
        </div>
      </div>

      <!-- Sessions header -->
      <div class="section-header">
        <h2>My Sessions</h2>
        <div class="header-actions">
          <a routerLink="/join" class="btn btn-outline btn-sm">Join a Session</a>
          <a routerLink="/create-session" class="btn btn-primary btn-sm">+ New Session</a>
        </div>
      </div>

      <!-- Sessions Container -->
      <div class="sessions-container">
        @if (loading()) {
          <div class="loading-state">
            <span class="spinner"></span>
            <p>Loading sessions...</p>
          </div>
        } @else if (errorMessage()) {
          <div class="empty-state">
            <strong>Could not load sessions.</strong>
            <p>{{ errorMessage() }}</p>
          </div>
        } @else if (sessions().length === 0) {
          <div class="empty-state">
            <strong>No sessions yet</strong>
            <p>Create your first Lean Coffee session to get started.</p>
          </div>
        } @else {
          <div class="session-list">
            @for (session of sessions(); track session.id) {
              <div class="session-card">
                <div class="session-card__info">
                  <div class="session-card__title">{{ session.title }}</div>
                  <div class="session-card__meta">
                    {{ session.createdAt | date:'mediumDate' }}
                    @if (session.description) {
                      · {{ truncateDescription(session.description) }}
                    }
                  </div>
                </div>
                <div class="session-card__actions">
                  <span class="session-card__code" title="Join code">{{ session.joinCode }}</span>
                  <a [routerLink]="['/organizer-session']" [queryParams]="{ sessionId: session.id }" class="btn btn-outline btn-sm card-btn">Manage</a>
                  <a [routerLink]="['/join']" [queryParams]="{ code: session.joinCode }" class="btn btn-outline btn-sm card-btn hover-sky">Join</a>
                </div>
              </div>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    :host {
      width: 100%;
      max-width: 760px;
      margin: 0 auto;
      display: block;
    }
    .dashboard-page {
      width: 100%;
    }
    .topbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 2.5rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      padding-bottom: 1.25rem;
    }
    .logo-title {
      font-size: 1.8rem;
      background: linear-gradient(to right, #818cf8, #6366f1);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-weight: 800;
    }
    .topbar-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .welcome {
      font-size: 0.9rem;
      color: var(--text-muted);
    }
    .btn-sm {
      width: auto;
      padding: 0.5rem 1rem;
      font-size: 0.85rem;
      border-radius: 8px;
    }
    .section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1.5rem;
      h2 {
        font-size: 1.1rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: var(--text-muted);
      }
    }
    .header-actions {
      display: flex;
      gap: 0.75rem;
    }
    .sessions-container {
      width: 100%;
    }
    .loading-state {
      text-align: center;
      padding: 3rem;
      color: var(--text-muted);
      p {
        margin-top: 0.75rem;
        font-size: 0.9rem;
      }
    }
    .session-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .session-card {
      background: var(--panel-glass);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid var(--border-glass);
      border-radius: 15px;
      padding: 1.25rem 1.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1.5rem;
      transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
      
      &:hover {
        border-color: rgba(99, 102, 241, 0.2);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        transform: translateY(-2px);
      }
    }
    .session-card__info {
      flex: 1;
      min-width: 0;
    }
    .session-card__title {
      font-weight: 700;
      color: var(--text-main);
      font-size: 1.05rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .session-card__meta {
      font-size: 0.85rem;
      color: var(--text-muted);
      margin-top: 0.25rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .session-card__actions {
      display: flex;
      align-items: center;
      gap: 0.6rem;
    }
    .session-card__code {
      font-family: monospace;
      font-size: 0.95rem;
      font-weight: 700;
      color: #818cf8;
      background: rgba(99, 102, 241, 0.1);
      border: 1px dashed rgba(99, 102, 241, 0.3);
      padding: 0.25rem 0.6rem;
      border-radius: 6px;
      white-space: nowrap;
    }
    .card-btn {
      padding: 0.35rem 0.75rem;
      font-size: 0.8rem;
      border-radius: 6px;
    }
    .hover-sky:hover {
      border-color: #38bdf8;
      color: #38bdf8;
      background: rgba(56, 189, 248, 0.05);
    }
    
    @media (max-width: 600px) {
      .topbar {
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        text-align: center;
      }
      .section-header {
        flex-direction: column;
        align-items: stretch;
        gap: 1rem;
        text-align: center;
      }
      .header-actions {
        justify-content: center;
      }
      .session-card {
        flex-direction: column;
        align-items: stretch;
        gap: 1rem;
        padding: 1.25rem;
      }
      .session-card__info {
        text-align: left;
      }
      .session-card__actions {
        justify-content: flex-start;
        flex-wrap: wrap;
        width: 100%;
        border-top: 1px solid rgba(255, 255, 255, 0.05);
        padding-top: 0.75rem;
      }
      .session-card__code {
        margin-right: auto;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  protected readonly auth = inject(AuthService);
  private readonly sessionService = inject(SessionService);

  sessions = signal<Session[]>([]);
  loading = signal(true);
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.loadSessions();
  }

  loadSessions(): void {
    this.loading.set(true);
    this.errorMessage.set(null);

    this.sessionService.getMySessions().subscribe({
      next: (res) => {
        this.loading.set(false);
        if (res.success && res.data) {
          this.sessions.set(res.data);
        } else {
          this.errorMessage.set(res.errorMessage || 'Failed to load sessions.');
        }
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set('Network error. Failed to retrieve sessions.');
      }
    });
  }

  truncateDescription(desc: string): string {
    if (desc.length > 60) {
      return desc.substring(0, 60) + '...';
    }
    return desc;
  }
}
