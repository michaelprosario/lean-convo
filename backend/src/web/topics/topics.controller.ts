import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Request, UseGuards } from '@nestjs/common';
import { ProposeTopicUseCase } from '../../core/use-cases/topics/propose-topic.use-case';
import { UpvoteTopicUseCase } from '../../core/use-cases/topics/upvote-topic.use-case';
import { EditTopicUseCase } from '../../core/use-cases/topics/edit-topic.use-case';
import { DeleteTopicUseCase } from '../../core/use-cases/topics/delete-topic.use-case';
import { GetSessionTopicsUseCase } from '../../core/use-cases/topics/get-session-topics.use-case';
import { OrganizerEditTopicUseCase } from '../../core/use-cases/topics/organizer-edit-topic.use-case';
import { SetTopicStatusUseCase } from '../../core/use-cases/topics/set-topic-status.use-case';
import { OrganizerDeleteTopicUseCase } from '../../core/use-cases/topics/organizer-delete-topic.use-case';
import { ProposeTopicCommand } from '../../core/commands/propose-topic.command';
import { UpvoteTopicCommand } from '../../core/commands/upvote-topic.command';
import { EditTopicCommand } from '../../core/commands/edit-topic.command';
import { DeleteTopicCommand } from '../../core/commands/delete-topic.command';
import { OrganizerEditTopicCommand } from '../../core/commands/organizer-edit-topic.command';
import { OrganizerDeleteTopicCommand } from '../../core/commands/organizer-delete-topic.command';
import { SetTopicStatusCommand } from '../../core/commands/set-topic-status.command';
import { ProposeTopicDto } from './dto/propose-topic.dto';
import { UpvoteTopicDto } from './dto/upvote-topic.dto';
import { EditTopicDto } from './dto/edit-topic.dto';
import { DeleteTopicDto } from './dto/delete-topic.dto';
import { OrganizerEditTopicDto } from './dto/organizer-edit-topic.dto';
import { SetTopicStatusDto } from './dto/set-topic-status.dto';
import { OrganizerDeleteTopicDto } from './dto/organizer-delete-topic.dto';
import { TopicResponseDto } from './dto/topic-response.dto';
import { AppResult } from '../../core/results/app-result';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('topics')
export class TopicsController {
  constructor(
    private readonly proposeTopicUseCase: ProposeTopicUseCase,
    private readonly upvoteTopicUseCase: UpvoteTopicUseCase,
    private readonly editTopicUseCase: EditTopicUseCase,
    private readonly deleteTopicUseCase: DeleteTopicUseCase,
    private readonly getSessionTopicsUseCase: GetSessionTopicsUseCase,
    private readonly organizerEditTopicUseCase: OrganizerEditTopicUseCase,
    private readonly setTopicStatusUseCase: SetTopicStatusUseCase,
    private readonly organizerDeleteTopicUseCase: OrganizerDeleteTopicUseCase,
  ) {}

  @Post('propose')
  @HttpCode(HttpStatus.CREATED)
  async propose(@Body() dto: ProposeTopicDto): Promise<AppResult<TopicResponseDto>> {
    const command = new ProposeTopicCommand(
      dto.sessionId,
      dto.participantId,
      dto.title,
      dto.description ?? '',
    );
    const result = await this.proposeTopicUseCase.execute(command);

    if (!result.success) {
      return AppResult.fail(result.errorMessage!);
    }

    return AppResult.ok(this.toDto(result.data!));
  }

  @Post('upvote')
  @HttpCode(HttpStatus.OK)
  async upvote(@Body() dto: UpvoteTopicDto): Promise<AppResult<TopicResponseDto>> {
    const command = new UpvoteTopicCommand(dto.topicId, dto.participantId);
    const result = await this.upvoteTopicUseCase.execute(command);

    if (!result.success) {
      return AppResult.fail(result.errorMessage!);
    }

    return AppResult.ok(this.toDto(result.data!));
  }

  @Post('edit')
  @HttpCode(HttpStatus.OK)
  async edit(@Body() dto: EditTopicDto): Promise<AppResult<TopicResponseDto>> {
    const command = new EditTopicCommand(
      dto.topicId,
      dto.participantId,
      dto.title,
      dto.description ?? '',
    );
    const result = await this.editTopicUseCase.execute(command);

    if (!result.success) {
      return AppResult.fail(result.errorMessage!);
    }

    return AppResult.ok(this.toDto(result.data!));
  }

  @Post('delete')
  @HttpCode(HttpStatus.OK)
  async delete(@Body() dto: DeleteTopicDto): Promise<AppResult<void>> {
    const command = new DeleteTopicCommand(dto.topicId, dto.participantId);
    const result = await this.deleteTopicUseCase.execute(command);

    if (!result.success) {
      return AppResult.fail(result.errorMessage!);
    }

    return AppResult.ok();
  }

  @Get('by-session/:sessionId')
  @HttpCode(HttpStatus.OK)
  async getBySession(@Param('sessionId') sessionId: string): Promise<AppResult<TopicResponseDto[]>> {
    const result = await this.getSessionTopicsUseCase.execute(sessionId);

    if (!result.success) {
      return AppResult.fail(result.errorMessage!);
    }

    return AppResult.ok(result.data!.map((t) => this.toDto(t)));
  }

  @Post('organizer/edit')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async organizerEdit(
    @Request() req: { user: { userId: string; email: string } },
    @Body() dto: OrganizerEditTopicDto,
  ): Promise<AppResult<TopicResponseDto>> {
    const command = new OrganizerEditTopicCommand(
      dto.topicId,
      req.user.userId,
      dto.title,
      dto.description ?? '',
    );

    const result = await this.organizerEditTopicUseCase.execute(command);

    if (!result.success) {
      return AppResult.fail(result.errorMessage!);
    }

    return AppResult.ok(this.toDto(result.data!));
  }

  @Post('organizer/set-status')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async setStatus(
    @Request() req: { user: { userId: string; email: string } },
    @Body() dto: SetTopicStatusDto,
  ): Promise<AppResult<TopicResponseDto>> {
    const command = new SetTopicStatusCommand(dto.topicId, req.user.userId, dto.status);
    const result = await this.setTopicStatusUseCase.execute(command);

    if (!result.success) {
      return AppResult.fail(result.errorMessage!);
    }

    return AppResult.ok(this.toDto(result.data!));
  }

  @Post('organizer/delete')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async organizerDelete(
    @Request() req: { user: { userId: string; email: string } },
    @Body() dto: OrganizerDeleteTopicDto,
  ): Promise<AppResult<void>> {
    const command = new OrganizerDeleteTopicCommand(dto.topicId, req.user.userId);
    const result = await this.organizerDeleteTopicUseCase.execute(command);

    if (!result.success) {
      return AppResult.fail(result.errorMessage!);
    }

    return AppResult.ok();
  }

  private toDto(topic: import('../../core/domain/topic.entity').TopicEntity): TopicResponseDto {
    return {
      id: topic.id,
      sessionId: topic.sessionId,
      title: topic.title,
      description: topic.description,
      proposedBy: topic.proposedBy,
      upvoteCount: topic.upvoteCount,
      upvotedBy: topic.upvotedBy,
      status: topic.status,
      createdAt: topic.createdAt,
    };
  }
}
