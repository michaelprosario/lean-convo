import { Inject, Injectable } from '@nestjs/common';
import { OrganizerEditTopicCommand } from '../../commands/organizer-edit-topic.command';
import { TopicEntity } from '../../domain/topic.entity';
import type { ITopicRepository } from '../../interfaces/topic.repository.interface';
import { TOPIC_REPOSITORY } from '../../interfaces/topic.repository.interface';
import type { ISessionRepository } from '../../interfaces/session.repository.interface';
import { SESSION_REPOSITORY } from '../../interfaces/session.repository.interface';
import { AppResult } from '../../results/app-result';

@Injectable()
export class OrganizerEditTopicUseCase {
  constructor(
    @Inject(TOPIC_REPOSITORY) private readonly topicRepo: ITopicRepository,
    @Inject(SESSION_REPOSITORY) private readonly sessionRepo: ISessionRepository,
  ) {}

  async execute(command: OrganizerEditTopicCommand): Promise<AppResult<TopicEntity>> {
    if (!command.topicId) {
      return AppResult.fail('Topic ID is required.');
    }

    if (!command.organizerId) {
      return AppResult.fail('Organizer ID is required.');
    }

    if (!command.title || !command.title.trim()) {
      return AppResult.fail('Topic title is required.');
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
      return AppResult.fail('You do not have access to edit this topic.');
    }

    const updated = await this.topicRepo.update(command.topicId, {
      title: command.title.trim(),
      description: command.description?.trim() ?? '',
    });

    if (!updated) {
      return AppResult.fail('Topic not found.');
    }

    return AppResult.ok(updated);
  }
}
