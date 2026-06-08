import { UserEntity } from '../domain/user.entity';

export interface IUserRepository {
  findByEmail(email: string): Promise<UserEntity | null>;
  findById(id: string): Promise<UserEntity | null>;
  create(user: Omit<UserEntity, 'id' | 'createdAt'>): Promise<UserEntity>;
  existsByEmail(email: string): Promise<boolean>;
}

export const USER_REPOSITORY = 'IUserRepository';
