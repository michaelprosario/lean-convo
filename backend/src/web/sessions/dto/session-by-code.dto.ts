import { IsNotEmpty, IsString } from 'class-validator';

export class SessionByCodeDto {
  @IsString()
  @IsNotEmpty()
  joinCode: string;
}
