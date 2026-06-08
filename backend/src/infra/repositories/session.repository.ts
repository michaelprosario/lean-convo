import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Session, SessionDocument } from '../schemas/session.schema';
import { ISessionRepository } from '../../core/interfaces/session.repository.interface';
import { SessionEntity } from '../../core/domain/session.entity';

@Injectable()
export class SessionRepository implements ISessionRepository {
  constructor(@InjectModel(Session.name) private readonly sessionModel: Model<SessionDocument>) {}

  async create(session: Omit<SessionEntity, 'id' | 'createdAt'>): Promise<SessionEntity> {
    const created = new this.sessionModel(session);
    const saved = await created.save();
    return this.toEntity(saved);
  }

  async findById(id: string): Promise<SessionEntity | null> {
    const doc = await this.sessionModel.findById(id).exec();
    return doc ? this.toEntity(doc) : null;
  }

  async findByOrganizerId(organizerId: string): Promise<SessionEntity[]> {
    const docs = await this.sessionModel.find({ organizerId }).exec();
    return docs.map((d) => this.toEntity(d));
  }

  async findByJoinCode(joinCode: string): Promise<SessionEntity | null> {
    const doc = await this.sessionModel.findOne({ joinCode }).exec();
    return doc ? this.toEntity(doc) : null;
  }

  async update(id: string, partial: Partial<SessionEntity>): Promise<SessionEntity | null> {
    const doc = await this.sessionModel.findByIdAndUpdate(id, partial, { new: true }).exec();
    return doc ? this.toEntity(doc) : null;
  }

  private toEntity(doc: SessionDocument): SessionEntity {
    return new SessionEntity({
      id: (doc._id as object).toString(),
      title: doc.title,
      description: doc.description,
      organizerId: doc.organizerId,
      joinCode: doc.joinCode,
      videoLink: doc.videoLink,
      maxUpvotesPerParticipant: doc.maxUpvotesPerParticipant,
      createdAt: (doc as any).createdAt,
    });
  }
}
