export class EditTopicCommand {
  constructor(
    public readonly topicId: string,
    public readonly participantId: string,
    public readonly title: string,
    public readonly description: string,
  ) {}
}
