import { Inject, Injectable } from '@nestjs/common';
import { EditTopicCommand } from '../../commands/edit-topic.command';
import { TopicEntity } from '../../domain/topic.entity';
import type { ITopicRepository } from '../../interfaces/topic.repository.interface';
import { TOPIC_REPOSITORY } from '../../interfaces/topic.repository.interface';
import { AppResult } from '../../results/app-result';

@Injectable()
export class EditTopicUseCase {
  constructor(
    @Inject(TOPIC_REPOSITORY) private readonly topicRepo: ITopicRepository,
  ) {}

  async execute(command: EditTopicCommand): Promise<AppResult<TopicEntity>> {
    if (!command.topicId) {
      return AppResult.fail('Topic ID is required.');
    }

    if (!command.title || !command.title.trim()) {
      return AppResult.fail('Topic title is required.');
    }

    const topic = await this.topicRepo.findById(command.topicId);
    if (!topic) {
      return AppResult.fail('Topic not found.');
    }

    if (topic.proposedBy !== command.participantId) {
      return AppResult.fail('You can only edit topics you proposed.');
    }

    const updated = await this.topicRepo.update(command.topicId, {
      title: command.title.trim(),
      description: command.description?.trim() ?? '',
    });

    return AppResult.ok(updated!);
  }
}
