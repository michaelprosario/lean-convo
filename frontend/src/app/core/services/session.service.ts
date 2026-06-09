import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Session, SessionResponse, SessionsListResponse, ExportSessionResponse } from '../models/session.types';

@Injectable({ providedIn: 'root' })
export class SessionService {
  private readonly http = inject(HttpClient);

  getMySessions(): Observable<SessionsListResponse> {
    return this.http.get<SessionsListResponse>('/sessions/my-sessions');
  }

  createSession(payload: Partial<Session>): Observable<SessionResponse> {
    return this.http.post<SessionResponse>('/sessions/create', payload);
  }

  editSession(payload: Partial<Session> & { sessionId: string }): Observable<SessionResponse> {
    return this.http.post<SessionResponse>('/sessions/edit', payload);
  }

  getSessionByCode(joinCode: string): Observable<SessionResponse> {
    return this.http.post<SessionResponse>('/sessions/by-code', { joinCode });
  }

  exportSession(sessionId: string): Observable<ExportSessionResponse> {
    return this.http.get<ExportSessionResponse>(`/sessions/${encodeURIComponent(sessionId)}/export`);
  }
}
