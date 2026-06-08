import { Inject, Injectable } from '@nestjs/common';
import { SessionEntity } from '../../domain/session.entity';
import type { ISessionRepository } from '../../interfaces/session.repository.interface';
import { SESSION_REPOSITORY } from '../../interfaces/session.repository.interface';
import { AppResult } from '../../results/app-result';

@Injectable()
export class GetSessionByCodeUseCase {
  constructor(
    @Inject(SESSION_REPOSITORY) private readonly sessionRepo: ISessionRepository,
  ) {}

  async execute(joinCode: string): Promise<AppResult<SessionEntity>> {
    if (!joinCode || !joinCode.trim()) {
      return AppResult.fail('Join code is required.');
    }

    const session = await this.sessionRepo.findByJoinCode(joinCode.trim().toUpperCase());

    if (!session) {
      return AppResult.fail('Session not found. Please check the join code.');
    }

    return AppResult.ok(session);
  }
}
