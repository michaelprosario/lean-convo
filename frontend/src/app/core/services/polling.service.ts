import { inject, Injectable, signal, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { interval, Subscription, switchMap, startWith } from 'rxjs';
import { Topic, TopicsListResponse } from '../models/topic.types';

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
        switchMap(() => this.http.get<TopicsListResponse>(`/topics/by-session/${encodeURIComponent(sessionId)}`))
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
