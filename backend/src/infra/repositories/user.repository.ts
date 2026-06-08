import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { IUserRepository } from '../../core/interfaces/user.repository.interface';
import { UserEntity } from '../../core/domain/user.entity';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {}

  async findByEmail(email: string): Promise<UserEntity | null> {
    const doc = await this.userModel.findOne({ email: email.toLowerCase() }).exec();
    return doc ? this.toEntity(doc) : null;
  }

  async findById(id: string): Promise<UserEntity | null> {
    const doc = await this.userModel.findById(id).exec();
    return doc ? this.toEntity(doc) : null;
  }

  async create(user: Omit<UserEntity, 'id' | 'createdAt'>): Promise<UserEntity> {
    const created = new this.userModel(user);
    const saved = await created.save();
    return this.toEntity(saved);
  }

  async existsByEmail(email: string): Promise<boolean> {
    const count = await this.userModel.countDocuments({ email: email.toLowerCase() }).exec();
    return count > 0;
  }

  private toEntity(doc: UserDocument): UserEntity {
    return new UserEntity({
      id: (doc._id as object).toString(),
      email: doc.email,
      passwordHash: doc.passwordHash,
      displayName: doc.displayName,
      createdAt: (doc as any).createdAt,
    });
  }
}
