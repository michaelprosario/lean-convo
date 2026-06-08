import { Inject, Injectable } from '@nestjs/common';
import { DeleteTopicCommand } from '../../commands/delete-topic.command';
import type { ITopicRepository } from '../../interfaces/topic.repository.interface';
import { TOPIC_REPOSITORY } from '../../interfaces/topic.repository.interface';
import { AppResult } from '../../results/app-result';

@Injectable()
export class DeleteTopicUseCase {
  constructor(
    @Inject(TOPIC_REPOSITORY) private readonly topicRepo: ITopicRepository,
  ) {}

  async execute(command: DeleteTopicCommand): Promise<AppResult<void>> {
    if (!command.topicId) {
      return AppResult.fail('Topic ID is required.');
    }

    const topic = await this.topicRepo.findById(command.topicId);
    if (!topic) {
      return AppResult.fail('Topic not found.');
    }

    if (topic.proposedBy !== command.participantId) {
      return AppResult.fail('You can only delete topics you proposed.');
    }

    await this.topicRepo.delete(command.topicId);

    return AppResult.ok();
  }
}
