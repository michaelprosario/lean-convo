import { Injectable, signal } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Topic } from '../models/topic.types';
import {
  DeleteTopicByOrganizerPayload,
  DeleteTopicByParticipantPayload,
  EditTopicByOrganizerPayload,
  EditTopicByParticipantPayload,
  ProposeTopicPayload,
  SetTopicStatusByOrganizerPayload,
  SocketAck,
  SocketEnvelope,
  TopicsUpdatedEvent,
  UpvoteTopicPayload,
} from '../models/topics-realtime.types';

type ConnectionState = 'disconnected' | 'connecting' | 'connected';

@Injectable({ providedIn: 'root' })
export class TopicsRealtimeService {
  private socket: Socket | null = null;
  private requestCounter = 0;
  private activeSessionId: string | null = null;
  private activeParticipantId: string | undefined;
  private readonly ackTimeoutMs = 10000;

  readonly topics = signal<Topic[]>([]);
  readonly connectionState = signal<ConnectionState>('disconnected');

  async connect(sessionId: string, participantId?: string): Promise<SocketAck<Topic[]>> {
    this.activeSessionId = sessionId;
    this.activeParticipantId = participantId;

    if (!this.socket) {
      this.initializeSocket();
    }

    if (!this.socket) {
      return { success: false, errorMessage: 'Unable to initialize websocket client.' };
    }

    if (!this.socket.connected) {
      this.connectionState.set('connecting');
      await this.waitForConnect();
    }

    const subscribeAck = await this.emitWithAck<Topic[]>('topics/subscribe', {
      sessionId,
      participantId,
    });

    if (subscribeAck.success && subscribeAck.data) {
      this.topics.set(subscribeAck.data);
    }

    return subscribeAck;
  }

  async disconnect(sessionId?: string): Promise<void> {
    if (!this.socket) {
      return;
    }

    if (sessionId) {
      await this.emitWithAck<void>('topics/unsubscribe', { sessionId });
    } else if (this.activeSessionId) {
      await this.emitWithAck<void>('topics/unsubscribe', { sessionId: this.activeSessionId });
    }

    this.socket.disconnect();
    this.socket.removeAllListeners();
    this.socket = null;
    this.topics.set([]);
    this.connectionState.set('disconnected');
    this.activeSessionId = null;
    this.activeParticipantId = undefined;
  }

  requestSnapshot(sessionId: string, participantId?: string): Promise<SocketAck<Topic[]>> {
    return this.emitWithAck<Topic[]>('topics/request-snapshot', { sessionId, participantId });
  }

  proposeTopic(payload: ProposeTopicPayload): Promise<SocketAck<Topic>> {
    return this.emitWithAck<Topic>('topics/propose', payload);
  }

  upvoteTopic(payload: UpvoteTopicPayload): Promise<SocketAck<Topic>> {
    return this.emitWithAck<Topic>('topics/upvote', payload);
  }

  editTopicByParticipant(payload: EditTopicByParticipantPayload): Promise<SocketAck<Topic>> {
    return this.emitWithAck<Topic>('topics/edit', payload);
  }

  deleteTopic(payload: DeleteTopicByParticipantPayload): Promise<SocketAck<void>> {
    return this.emitWithAck<void>('topics/delete', payload);
  }

  editTopicByOrganizer(payload: EditTopicByOrganizerPayload): Promise<SocketAck<Topic>> {
    return this.emitWithAck<Topic>('topics/organizer/edit', payload);
  }

  setTopicStatusByOrganizer(payload: SetTopicStatusByOrganizerPayload): Promise<SocketAck<Topic>> {
    return this.emitWithAck<Topic>('topics/organizer/set-status', payload);
  }

  deleteTopicByOrganizer(payload: DeleteTopicByOrganizerPayload): Promise<SocketAck<void>> {
    return this.emitWithAck<void>('topics/organizer/delete', payload);
  }

  private initializeSocket(): void {
    const accessToken = sessionStorage.getItem('accessToken');

    this.socket = io('/topics', {
      autoConnect: true,
      transports: ['websocket', 'polling'],
      auth: accessToken ? { token: `Bearer ${accessToken}` } : undefined,
    });

    this.socket.on('connect', () => {
      this.connectionState.set('connected');

      if (this.activeSessionId) {
        void this.requestSnapshot(this.activeSessionId, this.activeParticipantId).then((snapshot) => {
          if (snapshot.success && snapshot.data) {
            this.topics.set(snapshot.data);
          }
        });
      }
    });

    this.socket.on('disconnect', () => {
      this.connectionState.set('disconnected');
    });

    this.socket.on('connect_error', () => {
      this.connectionState.set('disconnected');
    });

    this.socket.on('topics/updated', (event: TopicsUpdatedEvent) => {
      if (event.success && event.data) {
        this.topics.set(event.data);
      }
    });
  }

  private waitForConnect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        reject(new Error('Socket client is not initialized.'));
        return;
      }

      if (this.socket.connected) {
        this.connectionState.set('connected');
        resolve();
        return;
      }

      const onConnect = () => {
        this.socket?.off('connect_error', onError);
        this.connectionState.set('connected');
        resolve();
      };

      const onError = () => {
        this.socket?.off('connect', onConnect);
        this.connectionState.set('disconnected');
        reject(new Error('Failed to connect websocket.'));
      };

      this.socket.once('connect', onConnect);
      this.socket.once('connect_error', onError);
    });
  }

  private async emitWithAck<TData>(eventName: string, payload: unknown): Promise<SocketAck<TData>> {
    if (!this.socket) {
      return {
        success: false,
        errorMessage: 'Websocket client is not connected.',
      };
    }

    if (!this.socket.connected) {
      return {
        success: false,
        errorMessage: 'Websocket is disconnected.',
      };
    }

    const requestId = this.nextRequestId();
    const envelope: SocketEnvelope<unknown> = {
      requestId,
      payload,
    };

    return new Promise<SocketAck<TData>>((resolve) => {
      let settled = false;
      const timeout = setTimeout(() => {
        if (settled) {
          return;
        }

        settled = true;
        resolve({
          requestId,
          success: false,
          errorMessage: `Timed out waiting for acknowledgement from ${eventName}.`,
        });
      }, this.ackTimeoutMs);

      this.socket?.emit(eventName, envelope, (ack?: SocketAck<TData>) => {
        if (settled) {
          return;
        }

        settled = true;
        clearTimeout(timeout);

        resolve(
          ack ?? {
            requestId,
            success: false,
            errorMessage: `No acknowledgement returned for ${eventName}.`,
          },
        );
      });
    });
  }

  private nextRequestId(): string {
    this.requestCounter += 1;
    return `ws-${Date.now()}-${this.requestCounter}`;
  }
}
