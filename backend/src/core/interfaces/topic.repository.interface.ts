import { TopicEntity } from '../domain/topic.entity';

export interface ITopicRepository {
  create(topic: Omit<TopicEntity, 'id' | 'createdAt'>): Promise<TopicEntity>;
  findById(id: string): Promise<TopicEntity | null>;
  findBySessionId(sessionId: string): Promise<TopicEntity[]>;
  update(id: string, partial: Partial<TopicEntity>): Promise<TopicEntity | null>;
  delete(id: string): Promise<void>;
}

export const TOPIC_REPOSITORY = 'ITopicRepository';
