import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ParticipantResponse } from '../models/participant.types';

@Injectable({ providedIn: 'root' })
export class ParticipantService {
  private readonly http = inject(HttpClient);

  joinSession(payload: { joinCode: string; name: string; linkedInUrl?: string }): Observable<ParticipantResponse> {
    return this.http.post<ParticipantResponse>('/participants/join', payload);
  }
}
