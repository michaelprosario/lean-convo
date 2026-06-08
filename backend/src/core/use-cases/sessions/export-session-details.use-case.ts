import { Inject, Injectable } from '@nestjs/common';
import type { ISessionRepository } from '../../interfaces/session.repository.interface';
import { SESSION_REPOSITORY } from '../../interfaces/session.repository.interface';
import type { ITopicRepository } from '../../interfaces/topic.repository.interface';
import { TOPIC_REPOSITORY } from '../../interfaces/topic.repository.interface';
import { AppResult } from '../../results/app-result';
import { SessionEntity } from '../../domain/session.entity';
import { TopicEntity } from '../../domain/topic.entity';

export interface ExportSessionDetailsResult {
  session: SessionEntity;
  topics: TopicEntity[];
  generatedAt: Date;
}

@Injectable()
export class ExportSessionDetailsUseCase {
  constructor(
    @Inject(SESSION_REPOSITORY) private readonly sessionRepo: ISessionRepository,
    @Inject(TOPIC_REPOSITORY) private readonly topicRepo: ITopicRepository,
  ) {}

  async execute(sessionId: string, organizerId: string): Promise<AppResult<ExportSessionDetailsResult>> {
    if (!sessionId) {
      return AppResult.fail('Session ID is required.');
    }

    if (!organizerId) {
      return AppResult.fail('Organizer ID is required.');
    }

    const session = await this.sessionRepo.findById(sessionId);
    if (!session) {
      return AppResult.fail('Session not found.');
    }

    if (session.organizerId !== organizerId) {
      return AppResult.fail('You do not have access to export this session.');
    }

    const topics = await this.topicRepo.findBySessionId(sessionId);
    const sorted = topics.sort((a, b) => b.upvoteCount - a.upvoteCount);

    return AppResult.ok({
      session,
      topics: sorted,
      generatedAt: new Date(),
    });
  }
}
