export class CreateSessionCommand {
  constructor(
    public readonly organizerId: string,
    public readonly title: string,
    public readonly description: string,
    public readonly maxUpvotesPerParticipant: number,
    public readonly videoLink?: string,
  ) {}
}
