import { IsNotEmpty, IsOptional, IsUrl, Min, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSessionDto {
  @IsNotEmpty()
  title: string;

  @IsOptional()
  description?: string;

  @IsInt()
  @Min(1)
  @Type(() => Number)
  maxUpvotesPerParticipant: number;

  @IsOptional()
  @IsUrl()
  videoLink?: string;
}
