import { Inject, Injectable } from '@nestjs/common';
import { UpvoteTopicCommand } from '../../commands/upvote-topic.command';
import { TopicEntity } from '../../domain/topic.entity';
import type { ITopicRepository } from '../../interfaces/topic.repository.interface';
import { TOPIC_REPOSITORY } from '../../interfaces/topic.repository.interface';
import type { IParticipantRepository } from '../../interfaces/participant.repository.interface';
import { PARTICIPANT_REPOSITORY } from '../../interfaces/participant.repository.interface';
import type { ISessionRepository } from '../../interfaces/session.repository.interface';
import { SESSION_REPOSITORY } from '../../interfaces/session.repository.interface';
import { AppResult } from '../../results/app-result';

@Injectable()
export class UpvoteTopicUseCase {
  constructor(
    @Inject(TOPIC_REPOSITORY) private readonly topicRepo: ITopicRepository,
    @Inject(PARTICIPANT_REPOSITORY) private readonly participantRepo: IParticipantRepository,
    @Inject(SESSION_REPOSITORY) private readonly sessionRepo: ISessionRepository,
  ) {}

  async execute(command: UpvoteTopicCommand): Promise<AppResult<TopicEntity>> {
    if (!command.topicId) {
      return AppResult.fail('Topic ID is required.');
    }

    if (!command.participantId) {
      return AppResult.fail('Participant ID is required.');
    }

    const topic = await this.topicRepo.findById(command.topicId);
    if (!topic) {
      return AppResult.fail('Topic not found.');
    }

    const participant = await this.participantRepo.findById(command.participantId);
    if (!participant) {
      return AppResult.fail('Participant not found.');
    }

    if (participant.sessionId !== topic.sessionId) {
      return AppResult.fail('Participant does not belong to this session.');
    }

    if (topic.upvotedBy.includes(command.participantId)) {
      return AppResult.fail('You have already upvoted this topic.');
    }

    const session = await this.sessionRepo.findById(topic.sessionId);
    if (!session) {
      return AppResult.fail('Session not found.');
    }

    const allTopics = await this.topicRepo.findBySessionId(topic.sessionId);
    const totalVotesUsed = allTopics.filter((t) => t.upvotedBy.includes(command.participantId)).length;

    if (totalVotesUsed >= session.maxUpvotesPerParticipant) {
      return AppResult.fail(
        `You have used all ${session.maxUpvotesPerParticipant} of your available upvotes.`,
      );
    }

    const updated = await this.topicRepo.update(command.topicId, {
      upvoteCount: topic.upvoteCount + 1,
      upvotedBy: [...topic.upvotedBy, command.participantId],
    });

    return AppResult.ok(updated!);
  }
}
