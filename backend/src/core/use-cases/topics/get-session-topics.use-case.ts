import { Inject, Injectable } from '@nestjs/common';
import { TopicEntity } from '../../domain/topic.entity';
import type { ITopicRepository } from '../../interfaces/topic.repository.interface';
import { TOPIC_REPOSITORY } from '../../interfaces/topic.repository.interface';
import { AppResult } from '../../results/app-result';

@Injectable()
export class GetSessionTopicsUseCase {
  constructor(
    @Inject(TOPIC_REPOSITORY) private readonly topicRepo: ITopicRepository,
  ) {}

  async execute(sessionId: string): Promise<AppResult<TopicEntity[]>> {
    if (!sessionId) {
      return AppResult.fail('Session ID is required.');
    }

    const topics = await this.topicRepo.findBySessionId(sessionId);
    const sorted = topics.sort((a, b) => b.upvoteCount - a.upvoteCount);

    return AppResult.ok(sorted);
  }
}
