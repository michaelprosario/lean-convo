import { IsNotEmpty, IsString } from 'class-validator';

export class UpvoteTopicDto {
  @IsString()
  @IsNotEmpty()
  topicId: string;

  @IsString()
  @IsNotEmpty()
  participantId: string;
}
