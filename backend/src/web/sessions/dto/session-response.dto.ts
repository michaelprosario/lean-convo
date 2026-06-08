export class SessionResponseDto {
  id: string;
  title: string;
  description: string;
  organizerId: string;
  joinCode: string;
  videoLink?: string;
  maxUpvotesPerParticipant: number;
  createdAt: Date;
}
