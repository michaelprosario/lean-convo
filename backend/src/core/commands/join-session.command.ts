export class JoinSessionCommand {
  constructor(
    public readonly joinCode: string,
    public readonly name: string,
    public readonly linkedInUrl?: string,
  ) {}
}
