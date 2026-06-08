import { Inject, Injectable } from '@nestjs/common';
import { ProposeTopicCommand } from '../../commands/propose-topic.command';
import { TopicEntity, TopicStatus } from '../../domain/topic.entity';
import type { ITopicRepository } from '../../interfaces/topic.repository.interface';
import { TOPIC_REPOSITORY } from '../../interfaces/topic.repository.interface';
import type { IParticipantRepository } from '../../interfaces/participant.repository.interface';
import { PARTICIPANT_REPOSITORY } from '../../interfaces/participant.repository.interface';
import { AppResult } from '../../results/app-result';

@Injectable()
export class ProposeTopicUseCase {
  constructor(
    @Inject(TOPIC_REPOSITORY) private readonly topicRepo: ITopicRepository,
    @Inject(PARTICIPANT_REPOSITORY) private readonly participantRepo: IParticipantRepository,
  ) {}

  async execute(command: ProposeTopicCommand): Promise<AppResult<TopicEntity>> {
    if (!command.title || !command.title.trim()) {
      return AppResult.fail('Topic title is required.');
    }

    if (!command.participantId) {
      return AppResult.fail('Participant ID is required.');
    }

    if (!command.sessionId) {
      return AppResult.fail('Session ID is required.');
    }

    const participant = await this.participantRepo.findById(command.participantId);
    if (!participant) {
      return AppResult.fail('Participant not found.');
    }

    if (participant.sessionId !== command.sessionId) {
      return AppResult.fail('Participant does not belong to this session.');
    }

    const topic = await this.topicRepo.create({
      sessionId: command.sessionId,
      title: command.title.trim(),
      description: command.description?.trim() ?? '',
      proposedBy: command.participantId,
      upvoteCount: 0,
      upvotedBy: [],
      status: TopicStatus.Todo,
    });

    return AppResult.ok(topic);
  }
}
