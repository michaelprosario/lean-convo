import { Inject, Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { plainToInstance, type ClassConstructor } from 'class-transformer';
import { validate } from 'class-validator';
import type { Server, Socket } from 'socket.io';
import { ProposeTopicUseCase } from '../../core/use-cases/topics/propose-topic.use-case';
import { UpvoteTopicUseCase } from '../../core/use-cases/topics/upvote-topic.use-case';
import { EditTopicUseCase } from '../../core/use-cases/topics/edit-topic.use-case';
import { DeleteTopicUseCase } from '../../core/use-cases/topics/delete-topic.use-case';
import { GetSessionTopicsUseCase } from '../../core/use-cases/topics/get-session-topics.use-case';
import { OrganizerEditTopicUseCase } from '../../core/use-cases/topics/organizer-edit-topic.use-case';
import { SetTopicStatusUseCase } from '../../core/use-cases/topics/set-topic-status.use-case';
import { OrganizerDeleteTopicUseCase } from '../../core/use-cases/topics/organizer-delete-topic.use-case';
import { ProposeTopicCommand } from '../../core/commands/propose-topic.command';
import { UpvoteTopicCommand } from '../../core/commands/upvote-topic.command';
import { EditTopicCommand } from '../../core/commands/edit-topic.command';
import { DeleteTopicCommand } from '../../core/commands/delete-topic.command';
import { OrganizerEditTopicCommand } from '../../core/commands/organizer-edit-topic.command';
import { SetTopicStatusCommand } from '../../core/commands/set-topic-status.command';
import { OrganizerDeleteTopicCommand } from '../../core/commands/organizer-delete-topic.command';
import { AppResult } from '../../core/results/app-result';
import type { TopicEntity } from '../../core/domain/topic.entity';
import { TOPIC_REPOSITORY, type ITopicRepository } from '../../core/interfaces/topic.repository.interface';
import {
  PARTICIPANT_REPOSITORY,
  type IParticipantRepository,
} from '../../core/interfaces/participant.repository.interface';
import { SESSION_REPOSITORY, type ISessionRepository } from '../../core/interfaces/session.repository.interface';
import { ProposeTopicDto } from '../topics/dto/propose-topic.dto';
import { UpvoteTopicDto } from '../topics/dto/upvote-topic.dto';
import { EditTopicDto } from '../topics/dto/edit-topic.dto';
import { DeleteTopicDto } from '../topics/dto/delete-topic.dto';
import { OrganizerEditTopicDto } from '../topics/dto/organizer-edit-topic.dto';
import { SetTopicStatusDto } from '../topics/dto/set-topic-status.dto';
import { OrganizerDeleteTopicDto } from '../topics/dto/organizer-delete-topic.dto';
import { TopicResponseDto } from '../topics/dto/topic-response.dto';
import { WsJwtService, type WsAuthenticatedUser } from './auth/ws-jwt.service';
import { SubscribeTopicsDto } from './dto/subscribe-topics.dto';
import { RequestSessionTopicsDto } from './dto/request-session-topics.dto';

type WsEnvelope<TPayload> = {
  requestId?: string;
  payload: TPayload;
};

type WsResponse<TData> = {
  requestId?: string;
  success: boolean;
  data?: TData;
  errorMessage?: string;
};

type ParsedEnvelope<TPayload> = {
  requestId?: string;
  data: TPayload;
};

type FailedEnvelope = {
  requestId?: string;
  errorMessage: string;
};

type AuthenticatedSocket = Socket & {
  data: {
    user?: WsAuthenticatedUser;
  };
};

@WebSocketGateway({ namespace: '/topics', cors: { origin: true, credentials: true } })
export class TopicsGateway implements OnGatewayConnection {
  private readonly logger = new Logger(TopicsGateway.name);

  @WebSocketServer()
  private readonly server: Server;

  constructor(
    private readonly proposeTopicUseCase: ProposeTopicUseCase,
    private readonly upvoteTopicUseCase: UpvoteTopicUseCase,
    private readonly editTopicUseCase: EditTopicUseCase,
    private readonly deleteTopicUseCase: DeleteTopicUseCase,
    private readonly getSessionTopicsUseCase: GetSessionTopicsUseCase,
    private readonly organizerEditTopicUseCase: OrganizerEditTopicUseCase,
    private readonly setTopicStatusUseCase: SetTopicStatusUseCase,
    private readonly organizerDeleteTopicUseCase: OrganizerDeleteTopicUseCase,
    private readonly wsJwtService: WsJwtService,
    @Inject(TOPIC_REPOSITORY) private readonly topicRepo: ITopicRepository,
    @Inject(PARTICIPANT_REPOSITORY) private readonly participantRepo: IParticipantRepository,
    @Inject(SESSION_REPOSITORY) private readonly sessionRepo: ISessionRepository,
  ) {}

  handleConnection(client: AuthenticatedSocket): void {
    const user = this.wsJwtService.extractUser(client);
    if (!user) {
      return;
    }

    client.data.user = user;
  }

  @SubscribeMessage('topics/subscribe')
  async subscribe(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() envelope: WsEnvelope<SubscribeTopicsDto>,
  ): Promise<WsResponse<TopicResponseDto[]>> {
    const parsed = await this.validateEnvelope(SubscribeTopicsDto, envelope);
    if ('errorMessage' in parsed) {
      return this.fail(parsed.requestId, parsed.errorMessage);
    }

    const accessResult = await this.validateSessionAccess(parsed.data.sessionId, parsed.data.participantId);
    if (!accessResult.success) {
      return this.fail(parsed.requestId, accessResult.errorMessage!);
    }

    client.join(this.getRoomName(parsed.data.sessionId));

    return this.getSnapshotResponse(parsed.requestId, parsed.data.sessionId);
  }

  @SubscribeMessage('topics/unsubscribe')
  async unsubscribe(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() envelope: WsEnvelope<SubscribeTopicsDto>,
  ): Promise<WsResponse<void>> {
    const parsed = await this.validateEnvelope(SubscribeTopicsDto, envelope);
    if ('errorMessage' in parsed) {
      return this.fail(parsed.requestId, parsed.errorMessage);
    }

    client.leave(this.getRoomName(parsed.data.sessionId));

    return this.ok(parsed.requestId);
  }

  @SubscribeMessage('topics/request-snapshot')
  async requestSnapshot(
    @ConnectedSocket() _client: AuthenticatedSocket,
    @MessageBody() envelope: WsEnvelope<RequestSessionTopicsDto>,
  ): Promise<WsResponse<TopicResponseDto[]>> {
    const parsed = await this.validateEnvelope(RequestSessionTopicsDto, envelope);
    if ('errorMessage' in parsed) {
      return this.fail(parsed.requestId, parsed.errorMessage);
    }

    const accessResult = await this.validateSessionAccess(parsed.data.sessionId, parsed.data.participantId);
    if (!accessResult.success) {
      return this.fail(parsed.requestId, accessResult.errorMessage!);
    }

    return this.getSnapshotResponse(parsed.requestId, parsed.data.sessionId);
  }

  @SubscribeMessage('topics/by-session')
  async bySession(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() envelope: WsEnvelope<RequestSessionTopicsDto>,
  ): Promise<WsResponse<TopicResponseDto[]>> {
    return this.requestSnapshot(client, envelope);
  }

  @SubscribeMessage('topics/propose')
  async propose(
    @ConnectedSocket() _client: AuthenticatedSocket,
    @MessageBody() envelope: WsEnvelope<ProposeTopicDto>,
  ): Promise<WsResponse<TopicResponseDto>> {
    const parsed = await this.validateEnvelope(ProposeTopicDto, envelope);
    if ('errorMessage' in parsed) {
      return this.fail(parsed.requestId, parsed.errorMessage);
    }

    const command = new ProposeTopicCommand(
      parsed.data.sessionId,
      parsed.data.participantId,
      parsed.data.title,
      parsed.data.description ?? '',
    );

    const result = await this.proposeTopicUseCase.execute(command);
    if (!result.success) {
      return this.fail(parsed.requestId, result.errorMessage!);
    }

    await this.broadcastUpdatedTopics(result.data!.sessionId);

    return this.ok(parsed.requestId, this.toDto(result.data!));
  }

  @SubscribeMessage('topics/upvote')
  async upvote(
    @ConnectedSocket() _client: AuthenticatedSocket,
    @MessageBody() envelope: WsEnvelope<UpvoteTopicDto>,
  ): Promise<WsResponse<TopicResponseDto>> {
    const parsed = await this.validateEnvelope(UpvoteTopicDto, envelope);
    if ('errorMessage' in parsed) {
      return this.fail(parsed.requestId, parsed.errorMessage);
    }

    const command = new UpvoteTopicCommand(parsed.data.topicId, parsed.data.participantId);
    const result = await this.upvoteTopicUseCase.execute(command);

    if (!result.success) {
      return this.fail(parsed.requestId, result.errorMessage!);
    }

    await this.broadcastUpdatedTopics(result.data!.sessionId);

    return this.ok(parsed.requestId, this.toDto(result.data!));
  }

  @SubscribeMessage('topics/edit')
  async edit(
    @ConnectedSocket() _client: AuthenticatedSocket,
    @MessageBody() envelope: WsEnvelope<EditTopicDto>,
  ): Promise<WsResponse<TopicResponseDto>> {
    const parsed = await this.validateEnvelope(EditTopicDto, envelope);
    if ('errorMessage' in parsed) {
      return this.fail(parsed.requestId, parsed.errorMessage);
    }

    const command = new EditTopicCommand(
      parsed.data.topicId,
      parsed.data.participantId,
      parsed.data.title,
      parsed.data.description ?? '',
    );

    const result = await this.editTopicUseCase.execute(command);

    if (!result.success) {
      return this.fail(parsed.requestId, result.errorMessage!);
    }

    await this.broadcastUpdatedTopics(result.data!.sessionId);

    return this.ok(parsed.requestId, this.toDto(result.data!));
  }

  @SubscribeMessage('topics/delete')
  async delete(
    @ConnectedSocket() _client: AuthenticatedSocket,
    @MessageBody() envelope: WsEnvelope<DeleteTopicDto>,
  ): Promise<WsResponse<void>> {
    const parsed = await this.validateEnvelope(DeleteTopicDto, envelope);
    if ('errorMessage' in parsed) {
      return this.fail(parsed.requestId, parsed.errorMessage);
    }

    const topicBeforeDelete = await this.topicRepo.findById(parsed.data.topicId);

    const command = new DeleteTopicCommand(parsed.data.topicId, parsed.data.participantId);
    const result = await this.deleteTopicUseCase.execute(command);

    if (!result.success) {
      return this.fail(parsed.requestId, result.errorMessage!);
    }

    if (topicBeforeDelete) {
      await this.broadcastUpdatedTopics(topicBeforeDelete.sessionId);
    }

    return this.ok(parsed.requestId);
  }

  @SubscribeMessage('topics/organizer/edit')
  async organizerEdit(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() envelope: WsEnvelope<OrganizerEditTopicDto>,
  ): Promise<WsResponse<TopicResponseDto>> {
    const parsed = await this.validateEnvelope(OrganizerEditTopicDto, envelope);
    if ('errorMessage' in parsed) {
      return this.fail(parsed.requestId, parsed.errorMessage);
    }

    const user = this.getOrganizerUser(client);
    if (!user) {
      return this.fail(parsed.requestId, 'Unauthorized organizer socket operation.');
    }

    const command = new OrganizerEditTopicCommand(
      parsed.data.topicId,
      user.userId,
      parsed.data.title,
      parsed.data.description ?? '',
    );

    const result = await this.organizerEditTopicUseCase.execute(command);

    if (!result.success) {
      return this.fail(parsed.requestId, result.errorMessage!);
    }

    await this.broadcastUpdatedTopics(result.data!.sessionId);

    return this.ok(parsed.requestId, this.toDto(result.data!));
  }

  @SubscribeMessage('topics/organizer/set-status')
  async organizerSetStatus(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() envelope: WsEnvelope<SetTopicStatusDto>,
  ): Promise<WsResponse<TopicResponseDto>> {
    const parsed = await this.validateEnvelope(SetTopicStatusDto, envelope);
    if ('errorMessage' in parsed) {
      return this.fail(parsed.requestId, parsed.errorMessage);
    }

    const user = this.getOrganizerUser(client);
    if (!user) {
      return this.fail(parsed.requestId, 'Unauthorized organizer socket operation.');
    }

    const command = new SetTopicStatusCommand(parsed.data.topicId, user.userId, parsed.data.status);
    const result = await this.setTopicStatusUseCase.execute(command);

    if (!result.success) {
      return this.fail(parsed.requestId, result.errorMessage!);
    }

    await this.broadcastUpdatedTopics(result.data!.sessionId);

    return this.ok(parsed.requestId, this.toDto(result.data!));
  }

  @SubscribeMessage('topics/organizer/delete')
  async organizerDelete(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() envelope: WsEnvelope<OrganizerDeleteTopicDto>,
  ): Promise<WsResponse<void>> {
    const parsed = await this.validateEnvelope(OrganizerDeleteTopicDto, envelope);
    if ('errorMessage' in parsed) {
      return this.fail(parsed.requestId, parsed.errorMessage);
    }

    const user = this.getOrganizerUser(client);
    if (!user) {
      return this.fail(parsed.requestId, 'Unauthorized organizer socket operation.');
    }

    const topicBeforeDelete = await this.topicRepo.findById(parsed.data.topicId);

    const command = new OrganizerDeleteTopicCommand(parsed.data.topicId, user.userId);
    const result = await this.organizerDeleteTopicUseCase.execute(command);

    if (!result.success) {
      return this.fail(parsed.requestId, result.errorMessage!);
    }

    if (topicBeforeDelete) {
      await this.broadcastUpdatedTopics(topicBeforeDelete.sessionId);
    }

    return this.ok(parsed.requestId);
  }

  private getOrganizerUser(client: AuthenticatedSocket): WsAuthenticatedUser | null {
    return client.data.user ?? this.wsJwtService.extractUser(client);
  }

  private getRoomName(sessionId: string): string {
    return `session:${sessionId}`;
  }

  private async validateSessionAccess(sessionId: string, participantId?: string): Promise<AppResult<void>> {
    const session = await this.sessionRepo.findById(sessionId);
    if (!session) {
      return AppResult.fail('Session not found.');
    }

    if (!participantId) {
      return AppResult.ok();
    }

    const participant = await this.participantRepo.findById(participantId);
    if (!participant || participant.sessionId !== sessionId) {
      return AppResult.fail('Participant does not belong to this session.');
    }

    return AppResult.ok();
  }

  private async getSnapshotResponse(requestId: string | undefined, sessionId: string): Promise<WsResponse<TopicResponseDto[]>> {
    const result = await this.getSessionTopicsUseCase.execute(sessionId);

    if (!result.success) {
      return this.fail(requestId, result.errorMessage!);
    }

    return this.ok(requestId, result.data!.map((topic) => this.toDto(topic)));
  }

  private async broadcastUpdatedTopics(sessionId: string): Promise<void> {
    const topicsResult = await this.getSessionTopicsUseCase.execute(sessionId);
    if (!topicsResult.success) {
      this.logger.warn(`Unable to broadcast topics for session ${sessionId}: ${topicsResult.errorMessage}`);
      return;
    }

    this.server.to(this.getRoomName(sessionId)).emit('topics/updated', {
      success: true,
      data: topicsResult.data!.map((topic) => this.toDto(topic)),
    });
  }

  private async validateEnvelope<TPayload extends object>(
    dtoClass: ClassConstructor<TPayload>,
    envelope: WsEnvelope<unknown>,
  ): Promise<ParsedEnvelope<TPayload> | FailedEnvelope> {
    const requestId = this.getRequestId(envelope);

    if (!envelope || typeof envelope !== 'object' || !('payload' in envelope)) {
      return {
        requestId,
        errorMessage: 'Invalid event envelope. Expected { requestId, payload }.',
      };
    }

    const payload = plainToInstance(dtoClass, (envelope as { payload: unknown }).payload);
    const validationErrors = await validate(payload as object);

    if (validationErrors.length > 0) {
      const firstConstraint = Object.values(validationErrors[0].constraints ?? {})[0] ?? 'Validation failed.';
      return {
        requestId,
        errorMessage: firstConstraint,
      };
    }

    return {
      requestId,
      data: payload,
    };
  }

  private getRequestId(envelope: unknown): string | undefined {
    if (!envelope || typeof envelope !== 'object') {
      return undefined;
    }

    const candidate = (envelope as { requestId?: unknown }).requestId;
    return typeof candidate === 'string' ? candidate : undefined;
  }

  private ok<TData>(requestId?: string, data?: TData): WsResponse<TData> {
    return {
      requestId,
      success: true,
      data,
    };
  }

  private fail<TData>(requestId: string | undefined, errorMessage: string): WsResponse<TData> {
    return {
      requestId,
      success: false,
      errorMessage,
    };
  }

  private toDto(topic: TopicEntity): TopicResponseDto {
    return {
      id: topic.id,
      sessionId: topic.sessionId,
      title: topic.title,
      description: topic.description,
      proposedBy: topic.proposedBy,
      upvoteCount: topic.upvoteCount,
      upvotedBy: topic.upvotedBy,
      status: topic.status,
      createdAt: topic.createdAt,
    };
  }
}
