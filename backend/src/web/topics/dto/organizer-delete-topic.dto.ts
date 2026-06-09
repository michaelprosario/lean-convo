import { IsNotEmpty, IsString } from 'class-validator';

export class OrganizerDeleteTopicDto {
  @IsString()
  @IsNotEmpty()
  topicId: string;
}
