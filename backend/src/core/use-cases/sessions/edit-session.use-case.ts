import { Inject, Injectable } from '@nestjs/common';
import { EditSessionCommand } from '../../commands/edit-session.command';
import { SessionEntity } from '../../domain/session.entity';
import type { ISessionRepository } from '../../interfaces/session.repository.interface';
import { SESSION_REPOSITORY } from '../../interfaces/session.repository.interface';
import { AppResult } from '../../results/app-result';

@Injectable()
export class EditSessionUseCase {
  constructor(
    @Inject(SESSION_REPOSITORY) private readonly sessionRepo: ISessionRepository,
  ) {}

  async execute(command: EditSessionCommand): Promise<AppResult<SessionEntity>> {
    if (!command.sessionId) {
      return AppResult.fail('Session ID is required.');
    }

    if (!command.organizerId) {
      return AppResult.fail('Organizer ID is required.');
    }

    if (!command.title || !command.title.trim()) {
      return AppResult.fail('Session title is required.');
    }

    if (command.maxUpvotesPerParticipant < 1) {
      return AppResult.fail('Max upvotes per participant must be at least 1.');
    }

    const session = await this.sessionRepo.findById(command.sessionId);
    if (!session) {
      return AppResult.fail('Session not found.');
    }

    if (session.organizerId !== command.organizerId) {
      return AppResult.fail('You do not have access to edit this session.');
    }

    const updated = await this.sessionRepo.update(command.sessionId, {
      title: command.title.trim(),
      description: command.description?.trim() ?? '',
      maxUpvotesPerParticipant: command.maxUpvotesPerParticipant,
      videoLink: command.videoLink?.trim() || undefined,
    });

    if (!updated) {
      return AppResult.fail('Session not found.');
    }

    return AppResult.ok(updated);
  }
}
