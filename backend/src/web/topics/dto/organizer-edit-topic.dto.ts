import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class OrganizerEditTopicDto {
  @IsString()
  @IsNotEmpty()
  topicId: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;
}
