import { Inject, Injectable } from '@nestjs/common';
import type { ISessionRepository } from '../../interfaces/session.repository.interface';
import { SESSION_REPOSITORY } from '../../interfaces/session.repository.interface';
import { AppResult } from '../../results/app-result';
import { SessionEntity } from '../../domain/session.entity';

@Injectable()
export class GetMySessionsUseCase {
  constructor(
    @Inject(SESSION_REPOSITORY) private readonly sessionRepo: ISessionRepository,
  ) {}

  async execute(organizerId: string): Promise<AppResult<SessionEntity[]>> {
    if (!organizerId) {
      return AppResult.fail('Organizer ID is required.');
    }
    const sessions = await this.sessionRepo.findByOrganizerId(organizerId);
    return AppResult.ok(sessions);
  }
}
