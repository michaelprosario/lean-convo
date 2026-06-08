export class UpvoteTopicCommand {
  constructor(
    public readonly topicId: string,
    public readonly participantId: string,
  ) {}
}
