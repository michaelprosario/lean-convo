import { Component, inject, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TopicsRealtimeService } from '../../../core/services/topics-realtime.service';
import { Topic } from '../../../core/models/topic.types';

@Component({
  selector: 'app-participant-session',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="session-page">
      <!-- Top bar -->
      <div class="topbar">
        <div class="topbar__left">
          <h1>{{ sessionTitle }}</h1>
          <p class="participant-badge">Joined as {{ participantName }}</p>
          @if (sessionJoinCode) {
            <p class="join-code-row">Join code: <span class="join-code">{{ sessionJoinCode }}</span></p>
          }
          @if (sessionDescription) {
            <p class="session-desc">{{ sessionDescription }}</p>
          }
          @if (sessionVideoLink) {
            <p class="meeting-link-row">
              Meeting link: <a [href]="sessionVideoLink" target="_blank" rel="noopener noreferrer">{{ sessionVideoLink }}</a>
            </p>
          }
        </div>
        <div class="topbar__right">
          <span class="badge-votes">{{ votesRemaining() }} upvotes remaining</span>
        </div>
      </div>

      <!-- Propose topic form -->
      <div class="card propose-card">
        <h2>Propose a Topic</h2>
        @if (proposeError()) {
          <div class="inline-alert">{{ proposeError() }}</div>
        }
        <div class="propose-row">
          <div class="propose-fields">
            <input type="text" [(ngModel)]="newTopicTitle" placeholder="Topic title (required)" maxlength="120" />
            <textarea [(ngModel)]="newTopicDesc" placeholder="Description (optional)" rows="2"></textarea>
          </div>
          <button class="btn btn-primary btn-propose" [disabled]="proposing() || !newTopicTitle.trim()" (click)="addTopic()">
            {{ proposing() ? 'Adding...' : 'Add Topic' }}
          </button>
        </div>
      </div>

      <!-- Topics section -->
      <div class="section-header">
        <h2>Topics</h2>
        <button class="refresh-btn" (click)="forceRefresh()">↻ Refresh</button>
      </div>

      <!-- Topics list -->
      <div class="topics-container">
        @if (realtime.connectionState() !== 'connected' && orderedTopics().length === 0) {
          <div class="spinner-container">
            <span class="spinner"></span>
            <p>Loading topics...</p>
          </div>
        } @else if (orderedTopics().length === 0) {
          <div class="empty-state">
            <strong>No topics proposed yet</strong>
            <p>Be the first to propose a topic!</p>
          </div>
        } @else {
          <div class="topic-list">
            @for (topic of orderedTopics(); track topic.id) {
              <div class="topic-card" [class.own-card]="topic.proposedBy === participantId">
                
                <!-- Vote column -->
                <div class="vote-col">
                  <button 
                    class="vote-btn" 
                    [class.voted]="hasVotedFor(topic)"
                    [disabled]="cannotVoteFor(topic)"
                    (click)="upvoteTopic(topic.id)"
                    [title]="getVoteButtonTitle(topic)"
                  >
                    ▲
                  </button>
                  <span class="vote-count">{{ topic.upvoteCount }}</span>
                </div>

                <!-- Topic info -->
                <div class="topic-body">
                  <div class="topic-title">{{ topic.title }}</div>
                  @if (topic.description) {
                    <div class="topic-desc">{{ topic.description }}</div>
                  }
                  <div class="topic-meta">
                    <span class="topic-status" [class]="'status-' + topic.status.toLowerCase()">{{ topic.status }}</span>
                    @if (topic.proposedBy === participantId) {
                      <span class="own-tag">Your topic</span>
                    }
                  </div>

                  <!-- Edit / Delete actions for own topics -->
                  @if (topic.proposedBy === participantId) {
                    <div class="topic-actions">
                      <button class="btn-action" (click)="startEditing(topic)">Edit</button>
                      <button class="btn-action delete" (click)="deleteTopic(topic.id)">Delete</button>
                    </div>

                    <!-- Inline edit form -->
                    @if (editingTopicId() === topic.id) {
                      <div class="edit-form">
                        <input type="text" [(ngModel)]="editTitle" placeholder="Edit title" maxlength="120" />
                        <textarea [(ngModel)]="editDesc" placeholder="Edit description" rows="2"></textarea>
                        <div class="edit-form-actions">
                          <button class="btn-save" (click)="saveEdit(topic.id)">Save</button>
                          <button class="btn-cancel" (click)="cancelEditing()">Cancel</button>
                        </div>
                        @if (editError()) {
                          <div class="inline-alert">{{ editError() }}</div>
                        }
                      </div>
                    }
                  }
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
      max-width: 720px;
      margin: 0 auto;
      display: block;
    }
    .session-page {
      width: 100%;
    }
    .topbar {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 2rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      padding-bottom: 1.25rem;
      gap: 1.5rem;
    }
    .participant-badge {
      font-size: 0.85rem;
      color: #38bdf8;
      font-weight: 600;
      margin-top: 0.25rem;
    }
    .session-desc {
      font-size: 0.9rem;
      color: var(--text-muted);
      margin-top: 0.5rem;
      line-height: 1.4;
      max-width: 60ch;
    }
    .join-code-row {
      margin-top: 0.5rem;
      font-size: 0.85rem;
      color: var(--text-muted);
    }
    .join-code {
      font-family: monospace;
      font-weight: 700;
      color: #38bdf8;
      background: rgba(56, 189, 248, 0.1);
      border: 1px dashed rgba(56, 189, 248, 0.3);
      border-radius: 6px;
      padding: 0.1rem 0.45rem;
      margin-left: 0.25rem;
    }
    .meeting-link-row {
      margin-top: 0.5rem;
      font-size: 0.85rem;
      a {
        color: #38bdf8;
      }
    }
    .badge-votes {
      background: rgba(99, 102, 241, 0.1);
      color: #818cf8;
      border: 1px solid rgba(99, 102, 241, 0.3);
      border-radius: 8px;
      padding: 0.4rem 0.8rem;
      font-size: 0.85rem;
      font-weight: 600;
      white-space: nowrap;
    }
    .propose-card {
      max-width: 100%;
      margin-bottom: 2rem;
      h2 {
        font-size: 1.1rem;
        margin-bottom: 1rem;
      }
    }
    .propose-row {
      display: flex;
      gap: 1rem;
      align-items: flex-end;
    }
    .propose-fields {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .btn-propose {
      width: auto;
      align-self: flex-end;
      padding: 0.7rem 1.25rem;
    }
    .section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1rem;
      h2 {
        font-size: 1.1rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: var(--text-muted);
      }
    }
    .refresh-btn {
      background: none;
      border: none;
      color: var(--text-muted);
      font-size: 0.85rem;
      cursor: pointer;
      padding: 0.25rem 0.5rem;
      border-radius: 6px;
      transition: color 0.2s, background-color 0.2s;
      &:hover {
        color: var(--accent-primary);
        background-color: rgba(255, 255, 255, 0.03);
      }
    }
    .spinner-container {
      text-align: center;
      padding: 3rem;
      color: var(--text-muted);
      p {
        margin-top: 0.75rem;
        font-size: 0.9rem;
      }
    }
    .topic-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .topic-card {
      background: var(--panel-glass);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid var(--border-glass);
      border-radius: 16px;
      padding: 1.25rem;
      display: flex;
      gap: 1.25rem;
      align-items: flex-start;
      transition: border-color 0.2s, transform 0.2s;
      
      &:hover {
        border-color: rgba(255, 255, 255, 0.12);
        transform: translateY(-1px);
      }
    }
    .own-card {
      border-left: 3px solid var(--accent-primary);
    }
    .vote-col {
      display: flex;
      flex-direction: column;
      align-items: center;
      min-width: 44px;
      gap: 0.25rem;
    }
    .vote-btn {
      background: none;
      border: 1.5px solid rgba(255, 255, 255, 0.15);
      color: var(--text-muted);
      border-radius: 8px;
      padding: 0.3rem 0.6rem;
      font-size: 0.9rem;
      cursor: pointer;
      line-height: 1;
      transition: all 0.2s;
      
      &:hover:not(:disabled) {
        background: rgba(99, 102, 241, 0.1);
        border-color: var(--accent-primary);
        color: var(--text-main);
      }
      &.voted {
        background: var(--accent-primary);
        border-color: var(--accent-primary);
        color: #fff;
        box-shadow: 0 0 10px rgba(99, 102, 241, 0.3);
      }
      &:disabled {
        opacity: 0.35;
        cursor: not-allowed;
      }
    }
    .vote-count {
      font-size: 1rem;
      font-weight: 700;
      color: var(--text-main);
    }
    .topic-body {
      flex: 1;
      min-width: 0;
    }
    .topic-title {
      font-weight: 700;
      color: var(--text-main);
      font-size: 1.05rem;
      line-height: 1.4;
    }
    .topic-desc {
      font-size: 0.88rem;
      color: var(--text-muted);
      margin-top: 0.25rem;
      line-height: 1.4;
    }
    .topic-meta {
      font-size: 0.8rem;
      color: var(--text-muted);
      margin-top: 0.5rem;
      display: flex;
      gap: 1rem;
      align-items: center;
    }
    .topic-status {
      display: inline-block;
      padding: 0.15rem 0.5rem;
      border-radius: 999px;
      font-size: 0.7rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      
      &.status-todo { background: rgba(71, 85, 105, 0.2); border: 1px solid #475569; color: #94a3b8; }
      &.status-active { background: rgba(16, 185, 129, 0.15); border: 1px solid #10b981; color: #34d399; }
      &.status-done { background: rgba(59, 130, 246, 0.15); border: 1px solid #3b82f6; color: #60a5fa; }
    }
    .own-tag {
      color: #818cf8;
      font-weight: 600;
    }
    .topic-actions {
      display: flex;
      gap: 0.6rem;
      margin-top: 0.75rem;
    }
    .btn-action {
      background: none;
      border: 1px solid var(--border-glass);
      color: var(--text-muted);
      border-radius: 6px;
      padding: 0.25rem 0.6rem;
      font-size: 0.75rem;
      cursor: pointer;
      transition: all 0.2s;
      
      &:hover {
        border-color: rgba(255, 255, 255, 0.25);
        color: var(--text-main);
      }
      &.delete:hover {
        border-color: rgba(239, 68, 68, 0.4);
        color: #fca5a5;
        background-color: rgba(239, 68, 68, 0.05);
      }
    }
    .edit-form {
      margin-top: 0.75rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      background: rgba(0,0,0,0.15);
      padding: 1rem;
      border-radius: 10px;
      border: 1px solid var(--border-glass);
    }
    .edit-form-actions {
      display: flex;
      gap: 0.5rem;
    }
    .btn-save {
      background: var(--accent-primary);
      color: #fff;
      border: none;
      border-radius: 6px;
      padding: 0.35rem 0.85rem;
      font-size: 0.8rem;
      font-weight: 600;
      cursor: pointer;
      &:hover {
        background: var(--accent-primary-hover);
      }
    }
    .btn-cancel {
      background: transparent;
      border: 1px solid var(--border-glass);
      color: var(--text-muted);
      border-radius: 6px;
      padding: 0.35rem 0.85rem;
      font-size: 0.8rem;
      cursor: pointer;
      &:hover {
        color: var(--text-main);
      }
    }
    .inline-alert {
      font-size: 0.8rem;
      color: #fca5a5;
      margin-top: 0.4rem;
    }
    @media (max-width: 550px) {
      .topbar {
        flex-direction: column;
        align-items: stretch;
        gap: 1rem;
      }
      .topbar__right {
        align-self: flex-start;
      }
      .propose-row {
        flex-direction: column;
        align-items: stretch;
      }
      .btn-propose {
        align-self: stretch;
      }
      .topic-card {
        padding: 1rem;
        gap: 0.75rem;
      }
      .vote-col {
        min-width: 36px;
      }
      .vote-btn {
        padding: 0.25rem 0.5rem;
        font-size: 0.8rem;
      }
    }
  `]
})
export class ParticipantSessionComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  protected readonly realtime = inject(TopicsRealtimeService);

  // Cached context
  sessionId = '';
  sessionTitle = '';
  sessionJoinCode = '';
  sessionDescription = '';
  sessionVideoLink = '';
  participantId = '';
  participantName = '';
  maxUpvotes = 3;

  // Propose form state
  newTopicTitle = '';
  newTopicDesc = '';
  proposing = signal(false);
  proposeError = signal<string | null>(null);

  // Edit form state
  editingTopicId = signal<string | null>(null);
  editTitle = '';
  editDesc = '';
  editError = signal<string | null>(null);

  // Reactive computed signals
  readonly orderedTopics = computed(() => {
    const list = this.realtime.topics();
    return [...list].sort((a, b) => {
      const statusOrder = (status: string) => {
        const s = status.toLowerCase();
        if (s === 'active') return 0;
        if (s === 'todo') return 1;
        if (s === 'done' || s === 'completed') return 2;
        return 3;
      };
      const orderA = statusOrder(a.status);
      const orderB = statusOrder(b.status);
      if (orderA !== orderB) return orderA - orderB;
      // Stable sort: keep original index order (by creation/ID)
      return 0;
    });
  });

  readonly votesUsed = computed(() => {
    const list = this.realtime.topics();
    const pid = this.participantId;
    return list.filter(t => t.upvotedBy && t.upvotedBy.includes(pid)).length;
  });

  readonly votesRemaining = computed(() => {
    return Math.max(0, this.maxUpvotes - this.votesUsed());
  });

  ngOnInit(): void {
    const sid = sessionStorage.getItem('sessionId');
    const pid = sessionStorage.getItem('participantId');
    if (!sid || !pid) {
      this.router.navigate(['/join']);
      return;
    }

    this.sessionId = sid;
    this.participantId = pid;
    this.sessionTitle = sessionStorage.getItem('sessionTitle') || 'Session';
    this.sessionJoinCode = sessionStorage.getItem('joinCode') || '';
    this.sessionDescription = sessionStorage.getItem('sessionDescription') || '';
    this.sessionVideoLink = sessionStorage.getItem('sessionVideoLink') || '';
    this.participantName = sessionStorage.getItem('participantName') || 'Participant';
    this.maxUpvotes = parseInt(sessionStorage.getItem('maxUpvotes') || '3', 10);

    void this.initializeRealtime();
  }

  ngOnDestroy(): void {
    void this.realtime.disconnect(this.sessionId);
  }

  private async initializeRealtime(): Promise<void> {
    const connection = await this.realtime.connect(this.sessionId, this.participantId);
    if (!connection.success) {
      this.proposeError.set(connection.errorMessage || 'Unable to connect to live updates.');
    }
  }

  async forceRefresh(): Promise<void> {
    const result = await this.realtime.requestSnapshot(this.sessionId, this.participantId);
    if (result.success && result.data) {
      this.realtime.topics.set(result.data);
    }
  }

  async addTopic(): Promise<void> {
    const title = this.newTopicTitle.trim();
    const desc = this.newTopicDesc.trim();

    if (!title) {
      this.proposeError.set('Topic title is required.');
      return;
    }

    this.proposing.set(true);
    this.proposeError.set(null);

    const result = await this.realtime.proposeTopic({
      sessionId: this.sessionId,
      participantId: this.participantId,
      title,
      description: desc || undefined
    });

    this.proposing.set(false);
    if (result.success) {
      this.newTopicTitle = '';
      this.newTopicDesc = '';
      return;
    }

    this.proposeError.set(result.errorMessage || 'Could not add topic.');
  }

  hasVotedFor(topic: Topic): boolean {
    return topic.upvotedBy && topic.upvotedBy.includes(this.participantId);
  }

  cannotVoteFor(topic: Topic): boolean {
    // Cannot vote if already voted or if no votes are remaining
    return this.hasVotedFor(topic) || this.votesRemaining() <= 0;
  }

  getVoteButtonTitle(topic: Topic): string {
    if (this.hasVotedFor(topic)) return 'Already voted';
    if (this.votesRemaining() <= 0) return 'No votes remaining';
    return 'Upvote';
  }

  async upvoteTopic(topicId: string): Promise<void> {
    const result = await this.realtime.upvoteTopic({ topicId, participantId: this.participantId });
    if (!result.success) {
      alert(result.errorMessage || 'Failed to upvote topic.');
    }
  }

  async deleteTopic(topicId: string): Promise<void> {
    if (!confirm('Delete this topic? This cannot be undone.')) return;

    const result = await this.realtime.deleteTopic({ topicId, participantId: this.participantId });
    if (!result.success) {
      alert(result.errorMessage || 'Failed to delete topic.');
    }
  }

  startEditing(topic: Topic): void {
    this.editingTopicId.set(topic.id);
    this.editTitle = topic.title;
    this.editDesc = topic.description || '';
    this.editError.set(null);
  }

  cancelEditing(): void {
    this.editingTopicId.set(null);
  }

  async saveEdit(topicId: string): Promise<void> {
    const title = this.editTitle.trim();
    const desc = this.editDesc.trim();

    if (!title) {
      this.editError.set('Title is required.');
      return;
    }

    const result = await this.realtime.editTopicByParticipant({
      topicId,
      participantId: this.participantId,
      title,
      description: desc || undefined
    });

    if (result.success) {
      this.editingTopicId.set(null);
      return;
    }

    this.editError.set(result.errorMessage || 'Failed to save changes.');
  }
}
