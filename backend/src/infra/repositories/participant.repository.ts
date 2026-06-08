import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Participant, ParticipantDocument } from '../schemas/participant.schema';
import { IParticipantRepository } from '../../core/interfaces/participant.repository.interface';
import { ParticipantEntity } from '../../core/domain/participant.entity';

@Injectable()
export class ParticipantRepository implements IParticipantRepository {
  constructor(
    @InjectModel(Participant.name) private readonly participantModel: Model<ParticipantDocument>,
  ) {}

  async create(participant: Omit<ParticipantEntity, 'id' | 'createdAt'>): Promise<ParticipantEntity> {
    const created = new this.participantModel(participant);
    const saved = await created.save();
    return this.toEntity(saved);
  }

  async findById(id: string): Promise<ParticipantEntity | null> {
    const doc = await this.participantModel.findById(id).exec();
    return doc ? this.toEntity(doc) : null;
  }

  async findBySessionId(sessionId: string): Promise<ParticipantEntity[]> {
    const docs = await this.participantModel.find({ sessionId }).exec();
    return docs.map((d) => this.toEntity(d));
  }

  private toEntity(doc: ParticipantDocument): ParticipantEntity {
    return new ParticipantEntity({
      id: (doc._id as object).toString(),
      sessionId: doc.sessionId,
      name: doc.name,
      linkedInUrl: doc.linkedInUrl || undefined,
      createdAt: (doc as any).createdAt,
    });
  }
}
