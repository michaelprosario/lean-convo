import { ParticipantEntity } from '../domain/participant.entity';

export interface IParticipantRepository {
  create(participant: Omit<ParticipantEntity, 'id' | 'createdAt'>): Promise<ParticipantEntity>;
  findById(id: string): Promise<ParticipantEntity | null>;
  findBySessionId(sessionId: string): Promise<ParticipantEntity[]>;
}

export const PARTICIPANT_REPOSITORY = 'IParticipantRepository';
