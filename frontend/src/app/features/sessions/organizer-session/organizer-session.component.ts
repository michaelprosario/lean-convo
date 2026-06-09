import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SessionService } from '../../../core/services/session.service';
import { TopicService } from '../../../core/services/topic.service';
import { Session } from '../../../core/models/session.types';
import { Topic, TopicStatus } from '../../../core/models/topic.types';

@Component({
  selector: 'app-organizer-session',
  standalone: true,
  imports: [RouterLink, FormsModule],
  template: `
    <div class="organizer-session-page">
      <!-- Top bar -->
      <div class="topbar">
        <div>
          <h1 class="logo-title">Organizer Control Panel</h1>
          @if (sessionJoinCode) {
            <p class="invite-code-subtitle">Invite Code: <span class="invite-code">{{ sessionJoinCode }}</span></p>
          }
        </div>
        <div class="topbar-actions">
          <a routerLink="/dashboard" class="btn btn-outline btn-sm">Back to Dashboard</a>
          <button class="btn btn-outline btn-sm" (click)="onRefresh()">Refresh</button>
        </div>
      </div>

      <!-- Main session card -->
      <section class="card session-details-card">
        <h2 class="section-title">Session Details</h2>
        
        @if (sessionMessage()) {
          <div class="alert" [class.alert-success]="sessionMsgType() === 'ok'" [class.alert-error]="sessionMsgType() === 'err'">
            {{ sessionMessage() }}
          </div>
        }

        <div class="form-grid">
          <div class="form-group">
            <label for="session-title">Title</label>
            <input id="session-title" type="text" [(ngModel)]="sessionTitle" maxlength="120" />
          </div>
          <div class="form-group">
            <label for="session-votes">Max Upvotes Per Participant</label>
            <input id="session-votes" type="number" [(ngModel)]="sessionMaxVotes" min="1" max="100" />
          </div>
          <div class="form-group full-width">
            <label for="session-description">Description</label>
            <textarea id="session-description" [(ngModel)]="sessionDescription" rows="2"></textarea>
          </div>
          <div class="form-group full-width">
            <label for="session-video">Video Call Link</label>
            <input id="session-video" type="url" [(ngModel)]="sessionVideo" placeholder="https://..." />
          </div>
        </div>
        
        <div class="actions-row">
          <button class="btn btn-primary btn-auto" [disabled]="savingSession()" (click)="saveSession()">
            {{ savingSession() ? 'Saving...' : 'Save Session' }}
          </button>
          <button class="btn btn-outline btn-auto" (click)="exportJson()">Export JSON</button>
          <button class="btn btn-outline btn-auto" (click)="exportCsv()">Export CSV</button>
        </div>
      </section>

      <!-- Topics section -->
      <section class="card topics-card">
        <h2 class="section-title">Topics</h2>
        
        @if (loadingTopics()) {
          <div class="spinner-container">
            <span class="spinner"></span>
            <p>Loading topics...</p>
          </div>
        } @else if (topics().length === 0) {
          <div class="empty-state">
            <strong>No topics proposed yet</strong>
            <p>Topics proposed by participants will appear here.</p>
          </div>
        } @else {
          <div class="topic-list">
            @for (topic of topics(); track topic.id) {
              <div class="topic-item">
                <div class="topic-header">
                  <div class="topic-meta">
                    <span class="meta-tag"><strong>Votes:</strong> {{ topic.upvoteCount }}</span>
                    <span class="meta-tag"><strong>Proposed By:</strong> {{ topic.proposedBy }}</span>
                  </div>
                  <span class="status-pill" [class]="'status-' + topic.status">{{ topic.status }}</span>
                </div>

                <div class="topic-fields">
                  <div class="form-group">
                    <label>Title</label>
                    <input type="text" [(ngModel)]="topicTitles[topic.id]" maxlength="120" />
                  </div>
                  <div class="form-group">
                    <label>Description</label>
                    <textarea [(ngModel)]="topicDescriptions[topic.id]" rows="1"></textarea>
                  </div>
                  <div class="form-group inline-select">
                    <label>Status</label>
                    <select [(ngModel)]="topicStatuses[topic.id]">
                      <option value="Todo">Todo</option>
                      <option value="Active">Active</option>
                      <option value="Done">Done</option>
                    </select>
                  </div>
                </div>

                <div class="actions-row">
                  <button class="btn btn-primary btn-xs" (click)="updateTopic(topic.id)">Save Changes</button>
                  <button class="btn btn-outline btn-xs" (click)="updateTopicStatus(topic.id)">Update Status Only</button>
                  <button class="btn btn-outline btn-xs delete-btn" (click)="deleteTopic(topic.id)">Delete Topic</button>
                </div>
                
                @if (topicMessages[topic.id]) {
                  <p class="topic-msg" [class.ok]="topicMsgTypes[topic.id] === 'ok'" [class.err]="topicMsgTypes[topic.id] === 'err'">
                    {{ topicMessages[topic.id] }}
                  </p>
                }
              </div>
            }
          </div>
        }
      </section>
    </div>
  `,
  styles: [`
    :host {
      width: 100%;
      max-width: 900px;
      margin: 0 auto;
      display: block;
    }
    .organizer-session-page {
      width: 100%;
    }
    .topbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 2rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      padding-bottom: 1rem;
    }
    .logo-title {
      font-size: 1.6rem;
      background: linear-gradient(to right, #818cf8, #6366f1);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-weight: 800;
    }
    .invite-code-subtitle {
      font-size: 0.88rem;
      color: var(--text-muted);
      margin-top: 0.35rem;
    }
    .invite-code {
      font-family: monospace;
      font-size: 0.95rem;
      font-weight: 700;
      color: #38bdf8;
      background: rgba(56, 189, 248, 0.1);
      border: 1px dashed rgba(56, 189, 248, 0.3);
      padding: 0.15rem 0.5rem;
      border-radius: 6px;
      margin-left: 0.25rem;
    }
    .topbar-actions {
      display: flex;
      gap: 0.75rem;
    }
    .btn-sm {
      width: auto;
      padding: 0.5rem 1rem;
      font-size: 0.85rem;
      border-radius: 8px;
    }
    .session-details-card, .topics-card {
      max-width: 100%;
      margin-bottom: 1.5rem;
    }
    .section-title {
      font-size: 1.1rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-muted);
      margin-bottom: 1.5rem;
      border-left: 3px solid var(--accent-primary);
      padding-left: 0.75rem;
    }
    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.25rem;
      margin-bottom: 1.5rem;
    }
    .full-width {
      grid-column: span 2;
    }
    .actions-row {
      display: flex;
      gap: 0.75rem;
      flex-wrap: wrap;
      margin-top: 1rem;
    }
    .btn-auto {
      width: auto;
    }
    .btn-xs {
      width: auto;
      padding: 0.4rem 0.8rem;
      font-size: 0.8rem;
      border-radius: 6px;
    }
    .delete-btn:hover {
      border-color: rgba(239, 68, 68, 0.4);
      color: #fca5a5;
      background-color: rgba(239, 68, 68, 0.05);
    }
    .spinner-container {
      text-align: center;
      padding: 2rem;
      color: var(--text-muted);
      p {
        margin-top: 0.5rem;
        font-size: 0.85rem;
      }
    }
    .topic-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .topic-item {
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid var(--border-glass);
      border-radius: 12px;
      padding: 1.25rem;
      transition: border-color 0.2s;
      &:hover {
        border-color: rgba(255, 255, 255, 0.12);
      }
    }
    .topic-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }
    .topic-meta {
      display: flex;
      gap: 1rem;
      font-size: 0.85rem;
      color: var(--text-muted);
    }
    .meta-tag {
      background: rgba(255, 255, 255, 0.04);
      padding: 0.2rem 0.5rem;
      border-radius: 6px;
      border: 1px solid var(--border-glass);
    }
    .topic-fields {
      display: grid;
      grid-template-columns: 1fr;
      gap: 0.75rem;
      margin-bottom: 1rem;
    }
    .inline-select {
      max-width: 200px;
    }
    .topic-msg {
      font-size: 0.8rem;
      margin-top: 0.5rem;
      &.ok { color: var(--alert-success-text); }
      &.err { color: var(--alert-error-text); }
    }
    @media (max-width: 600px) {
      .topbar {
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        text-align: center;
      }
      .topbar-actions {
        justify-content: center;
        width: 100%;
      }
      .form-grid {
        grid-template-columns: 1fr;
      }
      .full-width {
        grid-column: span 1;
      }
      .actions-row {
        justify-content: center;
        width: 100%;
      }
      .actions-row .btn {
        width: 100%;
      }
      .topic-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.75rem;
      }
      .topic-meta {
        flex-direction: column;
        gap: 0.4rem;
      }
    }
  `]
})
export class OrganizerSessionComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly sessionService = inject(SessionService);
  private readonly topicService = inject(TopicService);

  sessionId = '';
  sessionTitle = '';
  sessionDescription = '';
  sessionMaxVotes = 3;
  sessionVideo = '';
  sessionJoinCode = '';

  activeSession: Session | null = null;
  topics = signal<Topic[]>([]);

  // Page level messaging
  sessionMessage = signal<string | null>(null);
  sessionMsgType = signal<'ok' | 'err' | null>(null);

  // Form states
  savingSession = signal(false);
  loadingTopics = signal(false);

  // Dicts to hold temporary input values for topic items
  topicTitles: { [key: string]: string } = {};
  topicDescriptions: { [key: string]: string } = {};
  topicStatuses: { [key: string]: TopicStatus } = {};
  topicMessages: { [key: string]: string } = {};
  topicMsgTypes: { [key: string]: 'ok' | 'err' | null } = {};

  ngOnInit(): void {
    const id = this.route.snapshot.queryParams['sessionId'];
    if (!id) {
      this.router.navigate(['/dashboard']);
      return;
    }
    this.sessionId = id;
    this.loadSession();
    this.loadTopics();
  }

  onRefresh(): void {
    this.sessionMessage.set(null);
    this.loadSession();
    this.loadTopics();
  }

  loadSession(): void {
    this.sessionService.getMySessions().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          const matched = res.data.find(s => s.id === this.sessionId);
          if (!matched) {
            this.showSessionMessage('Session not found for your account.', 'err');
            return;
          }
          this.activeSession = matched;
          this.sessionTitle = matched.title;
          this.sessionDescription = matched.description || '';
          this.sessionMaxVotes = matched.maxUpvotesPerParticipant;
          this.sessionVideo = matched.videoLink || '';
          this.sessionJoinCode = matched.joinCode;
        } else {
          this.showSessionMessage(res.errorMessage || 'Failed to load session details.', 'err');
        }
      },
      error: () => this.showSessionMessage('Failed to fetch session metadata.', 'err')
    });
  }

  loadTopics(): void {
    this.loadingTopics.set(true);
    this.topicService.getTopicsBySession(this.sessionId).subscribe({
      next: (res) => {
        this.loadingTopics.set(false);
        if (res.success && res.data) {
          this.topics.set(res.data);
          
          // Re-populate field binding trackers
          res.data.forEach(t => {
            this.topicTitles[t.id] = t.title;
            this.topicDescriptions[t.id] = t.description || '';
            this.topicStatuses[t.id] = t.status;
            this.topicMessages[t.id] = '';
            this.topicMsgTypes[t.id] = null;
          });
        }
      },
      error: () => this.loadingTopics.set(false)
    });
  }

  showSessionMessage(text: string, type: 'ok' | 'err'): void {
    this.sessionMessage.set(text);
    this.sessionMsgType.set(type);
  }

  saveSession(): void {
    if (!this.sessionTitle) {
      this.showSessionMessage('Title is required.', 'err');
      return;
    }
    if (this.sessionMaxVotes < 1) {
      this.showSessionMessage('Max votes must be at least 1.', 'err');
      return;
    }

    this.savingSession.set(true);
    this.sessionMessage.set(null);

    const payload = {
      sessionId: this.sessionId,
      title: this.sessionTitle,
      description: this.sessionDescription || undefined,
      maxUpvotesPerParticipant: this.sessionMaxVotes,
      videoLink: this.sessionVideo || undefined
    };

    this.sessionService.editSession(payload).subscribe({
      next: (res) => {
        this.savingSession.set(false);
        if (res.success && res.data) {
          this.showSessionMessage('Session settings updated successfully.', 'ok');
          this.activeSession = res.data;
        } else {
          this.showSessionMessage(res.errorMessage || 'Failed to update session.', 'err');
        }
      },
      error: () => {
        this.savingSession.set(false);
        this.showSessionMessage('Network error. Failed to save session settings.', 'err');
      }
    });
  }

  updateTopic(topicId: string): void {
    const title = this.topicTitles[topicId]?.trim();
    const description = this.topicDescriptions[topicId]?.trim();

    if (!title) {
      this.showTopicMessage(topicId, 'Title is required.', 'err');
      return;
    }

    this.topicService.editTopicByOrganizer({
      topicId,
      title,
      description: description || undefined
    }).subscribe({
      next: (res) => {
        if (res.success) {
          this.showTopicMessage(topicId, 'Topic content updated.', 'ok');
          this.loadTopics();
        } else {
          this.showTopicMessage(topicId, res.errorMessage || 'Failed to update topic.', 'err');
        }
      },
      error: () => this.showTopicMessage(topicId, 'Failed to update topic.', 'err')
    });
  }

  updateTopicStatus(topicId: string): void {
    const status = this.topicStatuses[topicId];
    this.topicService.setTopicStatusByOrganizer({ topicId, status }).subscribe({
      next: (res) => {
        if (res.success) {
          this.showTopicMessage(topicId, `Topic status updated to ${status}.`, 'ok');
          this.loadTopics();
        } else {
          this.showTopicMessage(topicId, res.errorMessage || 'Failed to update status.', 'err');
        }
      },
      error: () => this.showTopicMessage(topicId, 'Failed to update status.', 'err')
    });
  }

  deleteTopic(topicId: string): void {
    if (!confirm('Delete this topic? This cannot be undone.')) return;

    this.topicService.deleteTopicByOrganizer({ topicId }).subscribe({
      next: (res) => {
        if (res.success) {
          this.loadTopics();
        } else {
          this.showTopicMessage(topicId, res.errorMessage || 'Failed to delete topic.', 'err');
        }
      },
      error: () => this.showTopicMessage(topicId, 'Failed to delete topic.', 'err')
    });
  }

  showTopicMessage(topicId: string, text: string, type: 'ok' | 'err'): void {
    this.topicMessages[topicId] = text;
    this.topicMsgTypes[topicId] = type;
  }

  exportJson(): void {
    this.sessionService.exportSession(this.sessionId).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          const stamp = new Date().toISOString().replace(/[:.]/g, '-');
          this.downloadText(
            `session-export-${stamp}.json`,
            JSON.stringify(res.data, null, 2),
            'application/json'
          );
          this.showSessionMessage('JSON export file generated.', 'ok');
        } else {
          this.showSessionMessage(res.errorMessage || 'JSON export failed.', 'err');
        }
      },
      error: () => this.showSessionMessage('Export request failed.', 'err')
    });
  }

  exportCsv(): void {
    this.sessionService.exportSession(this.sessionId).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          const csv = this.toCsv(res.data);
          const stamp = new Date().toISOString().replace(/[:.]/g, '-');
          this.downloadText(
            `session-export-${stamp}.csv`,
            csv,
            'text/csv'
          );
          this.showSessionMessage('CSV export file generated.', 'ok');
        } else {
          this.showSessionMessage(res.errorMessage || 'CSV export failed.', 'err');
        }
      },
      error: () => this.showSessionMessage('Export request failed.', 'err')
    });
  }

  private downloadText(filename: string, text: string, mimeType: string): void {
    const blob = new Blob([text], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  private toCsv(exportData: any): string {
    const header = [
      'sessionId',
      'sessionTitle',
      'joinCode',
      'topicId',
      'topicTitle',
      'topicDescription',
      'topicStatus',
      'upvoteCount',
      'proposedBy',
      'createdAt',
    ];

    const rows = (exportData.topics || []).map((topic: any) => [
      exportData.session.id,
      exportData.session.title,
      exportData.session.joinCode,
      topic.id,
      topic.title,
      topic.description || '',
      topic.status,
      String(topic.upvoteCount),
      topic.proposedBy,
      String(topic.createdAt),
    ]);

    const all = [header, ...rows];
    return all
      .map((row) => row.map(this.csvCell).join(','))
      .join('\n');
  }

  private csvCell(value: any): string {
    const raw = String(value ?? '');
    const escaped = raw.replace(/"/g, '""');
    return '"' + escaped + '"';
  }
}
