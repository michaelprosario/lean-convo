import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Topic, TopicDocument } from '../schemas/topic.schema';
import { ITopicRepository } from '../../core/interfaces/topic.repository.interface';
import { TopicEntity, TopicStatus } from '../../core/domain/topic.entity';

@Injectable()
export class TopicRepository implements ITopicRepository {
  constructor(@InjectModel(Topic.name) private readonly topicModel: Model<TopicDocument>) {}

  async create(topic: Omit<TopicEntity, 'id' | 'createdAt'>): Promise<TopicEntity> {
    const created = new this.topicModel(topic);
    const saved = await created.save();
    return this.toEntity(saved);
  }

  async findById(id: string): Promise<TopicEntity | null> {
    const doc = await this.topicModel.findById(id).exec();
    return doc ? this.toEntity(doc) : null;
  }

  async findBySessionId(sessionId: string): Promise<TopicEntity[]> {
    const docs = await this.topicModel.find({ sessionId }).exec();
    return docs.map((d) => this.toEntity(d));
  }

  async update(id: string, partial: Partial<TopicEntity>): Promise<TopicEntity | null> {
    const doc = await this.topicModel
      .findByIdAndUpdate(id, partial, { returnDocument: 'after' })
      .exec();
    return doc ? this.toEntity(doc) : null;
  }

  async delete(id: string): Promise<void> {
    await this.topicModel.findByIdAndDelete(id).exec();
  }

  private toEntity(doc: TopicDocument): TopicEntity {
    return new TopicEntity({
      id: (doc._id as object).toString(),
      sessionId: doc.sessionId,
      title: doc.title,
      description: doc.description,
      proposedBy: doc.proposedBy,
      upvoteCount: doc.upvoteCount,
      upvotedBy: doc.upvotedBy ?? [],
      status: doc.status as TopicStatus,
      createdAt: (doc as any).createdAt,
    });
  }
}
