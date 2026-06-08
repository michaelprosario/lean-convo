export class ParticipantEntity {
  id: string;
  sessionId: string;
  name: string;
  linkedInUrl?: string;
  createdAt: Date;

  constructor(partial: Partial<ParticipantEntity>) {
    Object.assign(this, partial);
  }
}
