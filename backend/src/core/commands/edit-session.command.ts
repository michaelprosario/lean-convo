export class EditSessionCommand {
  constructor(
    public readonly sessionId: string,
    public readonly organizerId: string,
    public readonly title: string,
    public readonly description: string,
    public readonly maxUpvotesPerParticipant: number,
    public readonly videoLink?: string,
  ) {}
}
