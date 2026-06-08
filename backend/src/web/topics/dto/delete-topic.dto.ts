import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteTopicDto {
  @IsString()
  @IsNotEmpty()
  topicId: string;

  @IsString()
  @IsNotEmpty()
  participantId: string;
}
