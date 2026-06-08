export class TopicResponseDto {
  id: string;
  sessionId: string;
  title: string;
  description: string;
  proposedBy: string;
  upvoteCount: number;
  upvotedBy: string[];
  status: string;
  createdAt: Date;
}
