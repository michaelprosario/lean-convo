import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { ProposeTopicUseCase } from '../../core/use-cases/topics/propose-topic.use-case';
import { UpvoteTopicUseCase } from '../../core/use-cases/topics/upvote-topic.use-case';
import { EditTopicUseCase } from '../../core/use-cases/topics/edit-topic.use-case';
import { DeleteTopicUseCase } from '../../core/use-cases/topics/delete-topic.use-case';
import { GetSessionTopicsUseCase } from '../../core/use-cases/topics/get-session-topics.use-case';
import { ProposeTopicCommand } from '../../core/commands/propose-topic.command';
import { UpvoteTopicCommand } from '../../core/commands/upvote-topic.command';
import { EditTopicCommand } from '../../core/commands/edit-topic.command';
import { DeleteTopicCommand } from '../../core/commands/delete-topic.command';
import { ProposeTopicDto } from './dto/propose-topic.dto';
import { UpvoteTopicDto } from './dto/upvote-topic.dto';
import { EditTopicDto } from './dto/edit-topic.dto';
import { DeleteTopicDto } from './dto/delete-topic.dto';
import { TopicResponseDto } from './dto/topic-response.dto';
import { AppResult } from '../../core/results/app-result';

@Controller('topics')
export class TopicsController {
  constructor(
    private readonly proposeTopicUseCase: ProposeTopicUseCase,
    private readonly upvoteTopicUseCase: UpvoteTopicUseCase,
    private readonly editTopicUseCase: EditTopicUseCase,
    private readonly deleteTopicUseCase: DeleteTopicUseCase,
    private readonly getSessionTopicsUseCase: GetSessionTopicsUseCase,
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
