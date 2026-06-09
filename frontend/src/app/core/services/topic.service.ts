import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TopicResponse, TopicsListResponse, TopicStatus } from '../models/topic.types';

@Injectable({ providedIn: 'root' })
export class TopicService {
  private readonly http = inject(HttpClient);

  getTopicsBySession(sessionId: string): Observable<TopicsListResponse> {
    return this.http.get<TopicsListResponse>(`/topics/by-session/${encodeURIComponent(sessionId)}`);
  }

  proposeTopic(payload: {
    sessionId: string;
    participantId: string;
    title: string;
    description?: string;
  }): Observable<TopicResponse> {
    return this.http.post<TopicResponse>('/topics/propose', payload);
  }

  upvoteTopic(payload: { topicId: string; participantId: string }): Observable<TopicResponse> {
    return this.http.post<TopicResponse>('/topics/upvote', payload);
  }

  deleteTopic(payload: { topicId: string; participantId: string }): Observable<any> {
    return this.http.post('/topics/delete', payload);
  }

  editTopicByParticipant(payload: {
    topicId: string;
    participantId: string;
    title: string;
    description?: string;
  }): Observable<TopicResponse> {
    return this.http.post<TopicResponse>('/topics/edit', payload);
  }

  editTopicByOrganizer(payload: {
    topicId: string;
    title: string;
    description?: string;
  }): Observable<TopicResponse> {
    return this.http.post<TopicResponse>('/topics/organizer/edit', payload);
  }

  setTopicStatusByOrganizer(payload: { topicId: string; status: TopicStatus }): Observable<TopicResponse> {
    return this.http.post<TopicResponse>('/topics/organizer/set-status', payload);
  }

  deleteTopicByOrganizer(payload: { topicId: string }): Observable<any> {
    return this.http.post('/topics/organizer/delete', payload);
  }
}
