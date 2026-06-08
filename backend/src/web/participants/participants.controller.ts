import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { JoinSessionUseCase } from '../../core/use-cases/participants/join-session.use-case';
import { JoinSessionCommand } from '../../core/commands/join-session.command';
import { JoinSessionDto } from './dto/join-session.dto';
import { ParticipantResponseDto } from './dto/participant-response.dto';
import { AppResult } from '../../core/results/app-result';

@Controller('participants')
export class ParticipantsController {
  constructor(private readonly joinSessionUseCase: JoinSessionUseCase) {}

  @Post('join')
  @HttpCode(HttpStatus.CREATED)
  async join(@Body() dto: JoinSessionDto): Promise<AppResult<ParticipantResponseDto>> {
    const command = new JoinSessionCommand(dto.joinCode, dto.name, dto.linkedInUrl);
    const result = await this.joinSessionUseCase.execute(command);

    if (!result.success) {
      return AppResult.fail(result.errorMessage!);
    }

    const participant = result.data!;
    const responseDto: ParticipantResponseDto = {
      id: participant.id,
      sessionId: participant.sessionId,
      name: participant.name,
      linkedInUrl: participant.linkedInUrl,
      createdAt: participant.createdAt,
    };

    return AppResult.ok(responseDto);
  }
}
