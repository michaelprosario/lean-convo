export class SessionEntity {
  id: string;
  title: string;
  description: string;
  organizerId: string;
  joinCode: string;
  videoLink?: string;
  maxUpvotesPerParticipant: number;
  createdAt: Date;

  constructor(partial: Partial<SessionEntity>) {
    Object.assign(this, partial);
  }
}
