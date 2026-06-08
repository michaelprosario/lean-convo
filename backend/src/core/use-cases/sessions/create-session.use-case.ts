import { Inject, Injectable } from '@nestjs/common';
import { CreateSessionCommand } from '../../commands/create-session.command';
import { SessionEntity } from '../../domain/session.entity';
import type { ISessionRepository } from '../../interfaces/session.repository.interface';
import { SESSION_REPOSITORY } from '../../interfaces/session.repository.interface';
import { AppResult } from '../../results/app-result';
import { randomBytes } from 'crypto';

@Injectable()
export class CreateSessionUseCase {
  constructor(
    @Inject(SESSION_REPOSITORY) private readonly sessionRepo: ISessionRepository,
  ) {}

  async execute(command: CreateSessionCommand): Promise<AppResult<SessionEntity>> {
    if (!command.title || !command.title.trim()) {
      return AppResult.fail('Session title is required.');
    }

    if (!command.organizerId) {
      return AppResult.fail('Organizer ID is required.');
    }

    if (command.maxUpvotesPerParticipant < 1) {
      return AppResult.fail('Max upvotes per participant must be at least 1.');
    }

    const joinCode = randomBytes(3).toString('hex').toUpperCase();

    const session = await this.sessionRepo.create({
      title: command.title.trim(),
      description: command.description,
      organizerId: command.organizerId,
      joinCode,
      videoLink: command.videoLink,
      maxUpvotesPerParticipant: command.maxUpvotesPerParticipant,
    });

    return AppResult.ok(session);
  }
}
