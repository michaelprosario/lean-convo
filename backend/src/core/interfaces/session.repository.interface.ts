import { SessionEntity } from '../domain/session.entity';

export interface ISessionRepository {
  create(session: Omit<SessionEntity, 'id' | 'createdAt'>): Promise<SessionEntity>;
  findById(id: string): Promise<SessionEntity | null>;
  findByOrganizerId(organizerId: string): Promise<SessionEntity[]>;
  findByJoinCode(joinCode: string): Promise<SessionEntity | null>;
  update(id: string, partial: Partial<SessionEntity>): Promise<SessionEntity | null>;
}

export const SESSION_REPOSITORY = 'ISessionRepository';
