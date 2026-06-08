import { TopicResponseDto } from '../../topics/dto/topic-response.dto';

export class SessionExportResponseDto {
  session: {
    id: string;
    title: string;
    description: string;
    organizerId: string;
    joinCode: string;
    videoLink?: string;
    maxUpvotesPerParticipant: number;
    createdAt: Date;
  };
  topics: TopicResponseDto[];
  generatedAt: Date;
}
