import { Body, Controller, Post, Get, UseGuards, Request, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { CreateSessionUseCase } from '../../core/use-cases/sessions/create-session.use-case';
import { GetMySessionsUseCase } from '../../core/use-cases/sessions/get-my-sessions.use-case';
import { GetSessionByCodeUseCase } from '../../core/use-cases/sessions/get-session-by-code.use-case';
import { EditSessionUseCase } from '../../core/use-cases/sessions/edit-session.use-case';
import {
  ExportSessionDetailsUseCase,
  type ExportSessionDetailsResult,
} from '../../core/use-cases/sessions/export-session-details.use-case';
import { CreateSessionDto } from './dto/create-session.dto';
import { SessionResponseDto } from './dto/session-response.dto';
import { SessionByCodeDto } from './dto/session-by-code.dto';
import { EditSessionDto } from './dto/edit-session.dto';
import { CreateSessionCommand } from '../../core/commands/create-session.command';
import { EditSessionCommand } from '../../core/commands/edit-session.command';
import { AppResult } from '../../core/results/app-result';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { SessionExportResponseDto } from './dto/session-export-response.dto';

@Controller('sessions')
export class SessionsController {
  constructor(
    private readonly createSessionUseCase: CreateSessionUseCase,
    private readonly getMySessionsUseCase: GetMySessionsUseCase,
    private readonly getSessionByCodeUseCase: GetSessionByCodeUseCase,
    private readonly editSessionUseCase: EditSessionUseCase,
    private readonly exportSessionDetailsUseCase: ExportSessionDetailsUseCase,
  ) {}

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

  @Get('my-sessions')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async getMySessions(
    @Request() req: { user: { userId: string; email: string } },
  ): Promise<AppResult<SessionResponseDto[]>> {
    const result = await this.getMySessionsUseCase.execute(req.user.userId);

    if (!result.success) {
      return AppResult.fail(result.errorMessage!);
    }

    const sessions: SessionResponseDto[] = result.data!.map((session) => ({
      id: session.id,
      title: session.title,
      description: session.description,
      organizerId: session.organizerId,
      joinCode: session.joinCode,
      videoLink: session.videoLink,
      maxUpvotesPerParticipant: session.maxUpvotesPerParticipant,
      createdAt: session.createdAt,
    }));

    return AppResult.ok(sessions);
  }

  @Post('by-code')
  @HttpCode(HttpStatus.OK)
  async getByCode(@Body() dto: SessionByCodeDto): Promise<AppResult<SessionResponseDto>> {
    const result = await this.getSessionByCodeUseCase.execute(dto.joinCode);

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

  @Post('edit')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async editSession(
    @Request() req: { user: { userId: string; email: string } },
    @Body() dto: EditSessionDto,
  ): Promise<AppResult<SessionResponseDto>> {
    const command = new EditSessionCommand(
      dto.sessionId,
      req.user.userId,
      dto.title,
      dto.description ?? '',
      dto.maxUpvotesPerParticipant,
      dto.videoLink,
    );

    const result = await this.editSessionUseCase.execute(command);

    if (!result.success) {
      return AppResult.fail(result.errorMessage!);
    }

    return AppResult.ok(this.toSessionResponseDto(result.data!));
  }

  @Get(':sessionId/export')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async exportSession(
    @Request() req: { user: { userId: string; email: string } },
    @Param('sessionId') sessionId: string,
  ): Promise<AppResult<SessionExportResponseDto>> {
    const result = await this.exportSessionDetailsUseCase.execute(sessionId, req.user.userId);

    if (!result.success) {
      return AppResult.fail(result.errorMessage!);
    }

    return AppResult.ok(this.toSessionExportResponseDto(result.data!));
  }

  private toSessionResponseDto(session: import('../../core/domain/session.entity').SessionEntity): SessionResponseDto {
    return {
      id: session.id,
      title: session.title,
      description: session.description,
      organizerId: session.organizerId,
      joinCode: session.joinCode,
      videoLink: session.videoLink,
      maxUpvotesPerParticipant: session.maxUpvotesPerParticipant,
      createdAt: session.createdAt,
    };
  }

  private toSessionExportResponseDto(result: ExportSessionDetailsResult): SessionExportResponseDto {
    return {
      session: this.toSessionResponseDto(result.session),
      topics: result.topics.map((topic) => ({
        id: topic.id,
        sessionId: topic.sessionId,
        title: topic.title,
        description: topic.description,
        proposedBy: topic.proposedBy,
        upvoteCount: topic.upvoteCount,
        upvotedBy: topic.upvotedBy,
        status: topic.status,
        createdAt: topic.createdAt,
      })),
      generatedAt: result.generatedAt,
    };
  }
}
