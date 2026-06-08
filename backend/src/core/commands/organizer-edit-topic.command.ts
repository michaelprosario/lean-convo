export class OrganizerEditTopicCommand {
  constructor(
    public readonly topicId: string,
    public readonly organizerId: string,
    public readonly title: string,
    public readonly description: string,
  ) {}
}
