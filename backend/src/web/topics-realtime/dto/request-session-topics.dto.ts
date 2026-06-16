import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class RequestSessionTopicsDto {
  @IsString()
  @IsNotEmpty()
  sessionId: string;

  @IsString()
  @IsOptional()
  participantId?: string;
}
