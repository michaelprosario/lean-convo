import { TopicStatus } from '../domain/topic.entity';

export class SetTopicStatusCommand {
  constructor(
    public readonly topicId: string,
    public readonly organizerId: string,
    public readonly status: TopicStatus,
  ) {}
}
