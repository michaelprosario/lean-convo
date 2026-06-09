import { Inject, Injectable } from '@nestjs/common';
import { OrganizerDeleteTopicCommand } from '../../commands/organizer-delete-topic.command';
import type { ITopicRepository } from '../../interfaces/topic.repository.interface';
import { TOPIC_REPOSITORY } from '../../interfaces/topic.repository.interface';
import type { ISessionRepository } from '../../interfaces/session.repository.interface';
import { SESSION_REPOSITORY } from '../../interfaces/session.repository.interface';
import { AppResult } from '../../results/app-result';

@Injectable()
export class OrganizerDeleteTopicUseCase {
  constructor(
    @Inject(TOPIC_REPOSITORY) private readonly topicRepo: ITopicRepository,
    @Inject(SESSION_REPOSITORY) private readonly sessionRepo: ISessionRepository,
  ) {}

  async execute(command: OrganizerDeleteTopicCommand): Promise<AppResult<void>> {
    if (!command.topicId) {
      return AppResult.fail('Topic ID is required.');
    }

    if (!command.organizerId) {
      return AppResult.fail('Organizer ID is required.');
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
      return AppResult.fail('You do not have access to delete this topic.');
    }

    await this.topicRepo.delete(command.topicId);

    return AppResult.ok();
  }
}
