import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { TopicStatus } from '../../../core/domain/topic.entity';

export class SetTopicStatusDto {
  @IsString()
  @IsNotEmpty()
  topicId: string;

  @IsEnum(TopicStatus)
  status: TopicStatus;
}
