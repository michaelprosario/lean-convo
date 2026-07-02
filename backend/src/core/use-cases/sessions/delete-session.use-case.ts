import { Inject, Injectable } from '@nestjs/common';
import type { ISessionRepository } from '../../interfaces/session.repository.interface';
import { SESSION_REPOSITORY } from '../../interfaces/session.repository.interface';
import type { ITopicRepository } from '../../interfaces/topic.repository.interface';
import { TOPIC_REPOSITORY } from '../../interfaces/topic.repository.interface';
import { AppResult } from '../../results/app-result';

@Injectable()
export class DeleteSessionUseCase {
  constructor(
    @Inject(SESSION_REPOSITORY) private readonly sessionRepo: ISessionRepository,
    @Inject(TOPIC_REPOSITORY) private readonly topicRepo: ITopicRepository,
  ) {}

  async execute(sessionId: string, requestingUserId: string): Promise<AppResult<void>> {
    if (!sessionId) {
      return AppResult.fail('Session ID is required.');
    }

    if (!requestingUserId) {
      return AppResult.fail('User ID is required.');
    }

    const session = await this.sessionRepo.findById(sessionId);
    if (!session) {
      return AppResult.fail('Session not found.');
    }

    if (session.organizerId !== requestingUserId) {
      return AppResult.fail('You do not have permission to delete this session.');
    }

    // Delete all topics belonging to the session first
    const topics = await this.topicRepo.findBySessionId(sessionId);
    await Promise.all(topics.map((t) => this.topicRepo.delete(t.id)));

    const deleted = await this.sessionRepo.delete(sessionId);
    if (!deleted) {
      return AppResult.fail('Failed to delete session.');
    }

    return AppResult.ok(undefined);
  }
}
