import { Inject, Injectable } from '@nestjs/common';
import { JoinSessionCommand } from '../../commands/join-session.command';
import { ParticipantEntity } from '../../domain/participant.entity';
import type { IParticipantRepository } from '../../interfaces/participant.repository.interface';
import { PARTICIPANT_REPOSITORY } from '../../interfaces/participant.repository.interface';
import type { ISessionRepository } from '../../interfaces/session.repository.interface';
import { SESSION_REPOSITORY } from '../../interfaces/session.repository.interface';
import { AppResult } from '../../results/app-result';

@Injectable()
export class JoinSessionUseCase {
  constructor(
    @Inject(SESSION_REPOSITORY) private readonly sessionRepo: ISessionRepository,
    @Inject(PARTICIPANT_REPOSITORY) private readonly participantRepo: IParticipantRepository,
  ) {}

  async execute(command: JoinSessionCommand): Promise<AppResult<ParticipantEntity>> {
    if (!command.joinCode || !command.joinCode.trim()) {
      return AppResult.fail('Join code is required.');
    }

    if (!command.name || !command.name.trim()) {
      return AppResult.fail('Display name is required.');
    }

    const session = await this.sessionRepo.findByJoinCode(command.joinCode.trim().toUpperCase());

    if (!session) {
      return AppResult.fail('Session not found. Please check the join code.');
    }

    const participant = await this.participantRepo.create({
      sessionId: session.id,
      name: command.name.trim(),
      linkedInUrl: command.linkedInUrl?.trim() || undefined,
    });

    return AppResult.ok(participant);
  }
}
