import { Body, Controller, Post, UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { CreateSessionUseCase } from '../../core/use-cases/sessions/create-session.use-case';
import { CreateSessionDto } from './dto/create-session.dto';
import { SessionResponseDto } from './dto/session-response.dto';
import { CreateSessionCommand } from '../../core/commands/create-session.command';
import { AppResult } from '../../core/results/app-result';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('sessions')
export class SessionsController {
  constructor(private readonly createSessionUseCase: CreateSessionUseCase) {}

  @Post('create')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async createSession(
    @Request() req: { user: { userId: string; email: string } },
    @Body() dto: CreateSessionDto,
  ): Promise<AppResult<SessionResponseDto>> {
    const command = new CreateSessionCommand(
      req.user.userId,
      dto.title,
      dto.description ?? '',
      dto.maxUpvotesPerParticipant,
      dto.videoLink,
    );

    const result = await this.createSessionUseCase.execute(command);

    if (!result.success) {
      return AppResult.fail(result.errorMessage!);
    }

    const session = result.data!;
    const responseDto: SessionResponseDto = {
      id: session.id,
      title: session.title,
      description: session.description,
      organizerId: session.organizerId,
      joinCode: session.joinCode,
      videoLink: session.videoLink,
      maxUpvotesPerParticipant: session.maxUpvotesPerParticipant,
      createdAt: session.createdAt,
    };
    return AppResult.ok(responseDto);
  }
}
