import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class JoinSessionDto {
  @IsString()
  @IsNotEmpty()
  joinCode: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  linkedInUrl?: string;
}
