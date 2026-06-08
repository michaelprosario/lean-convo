import { Inject, Injectable } from '@nestjs/common';
import { SetTopicStatusCommand } from '../../commands/set-topic-status.command';
import { TopicEntity, TopicStatus } from '../../domain/topic.entity';
import type { ITopicRepository } from '../../interfaces/topic.repository.interface';
import { TOPIC_REPOSITORY } from '../../interfaces/topic.repository.interface';
import type { ISessionRepository } from '../../interfaces/session.repository.interface';
import { SESSION_REPOSITORY } from '../../interfaces/session.repository.interface';
import { AppResult } from '../../results/app-result';

@Injectable()
export class SetTopicStatusUseCase {
  constructor(
    @Inject(TOPIC_REPOSITORY) private readonly topicRepo: ITopicRepository,
    @Inject(SESSION_REPOSITORY) private readonly sessionRepo: ISessionRepository,
  ) {}

  async execute(command: SetTopicStatusCommand): Promise<AppResult<TopicEntity>> {
    if (!command.topicId) {
      return AppResult.fail('Topic ID is required.');
    }

    if (!command.organizerId) {
      return AppResult.fail('Organizer ID is required.');
    }

    if (!Object.values(TopicStatus).includes(command.status)) {
      return AppResult.fail('Invalid topic status.');
    }

    const topic = await this.topicRepo.findById(command.topicId);
    if (!topic) {
      return AppResult.fail('Topic not found.');
    }

    const session = await this.sessionRepo.findById(topic.sessionId);
    if (!session) {
      return AppResult.fail('Session not found.');
    }

    if (session.organizerId !== command.organizerId) {
      return AppResult.fail('You do not have access to change this topic status.');
    }

    if (command.status === TopicStatus.Active) {
      const topicsInSession = await this.topicRepo.findBySessionId(topic.sessionId);
      const activeTopics = topicsInSession.filter(
        (t) => t.id !== topic.id && t.status === TopicStatus.Active,
      );

      for (const activeTopic of activeTopics) {
        await this.topicRepo.update(activeTopic.id, { status: TopicStatus.Todo });
      }
    }

    const updated = await this.topicRepo.update(command.topicId, {
      status: command.status,
    });

    if (!updated) {
      return AppResult.fail('Topic not found.');
    }

    return AppResult.ok(updated);
  }
}
