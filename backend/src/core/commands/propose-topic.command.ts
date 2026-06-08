export class ProposeTopicCommand {
  constructor(
    public readonly sessionId: string,
    public readonly participantId: string,
    public readonly title: string,
    public readonly description: string,
  ) {}
}
