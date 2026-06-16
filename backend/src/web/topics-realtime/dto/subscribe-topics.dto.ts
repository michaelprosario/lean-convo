import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SubscribeTopicsDto {
  @IsString()
  @IsNotEmpty()
  sessionId: string;

  @IsString()
  @IsOptional()
  participantId?: string;
}
