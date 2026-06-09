export class OrganizerDeleteTopicCommand {
  constructor(
    public readonly topicId: string,
    public readonly organizerId: string,
  ) {}
}
