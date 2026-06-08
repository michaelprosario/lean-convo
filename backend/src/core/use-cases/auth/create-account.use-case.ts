import { Inject, Injectable } from '@nestjs/common';
import { CreateAccountCommand } from '../../commands/create-account.command';
import { UserEntity } from '../../domain/user.entity';
import type { IUserRepository } from '../../interfaces/user.repository.interface';
import { USER_REPOSITORY } from '../../interfaces/user.repository.interface';
import type { IPasswordService } from '../../interfaces/password.service.interface';
import { PASSWORD_SERVICE } from '../../interfaces/password.service.interface';
import { AppResult } from '../../results/app-result';

@Injectable()
export class CreateAccountUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepo: IUserRepository,
    @Inject(PASSWORD_SERVICE) private readonly passwordService: IPasswordService,
  ) {}

  async execute(command: CreateAccountCommand): Promise<AppResult<UserEntity>> {
    if (!command.email || !command.password || !command.displayName) {
      return AppResult.fail('Email, password, and display name are required.');
    }

    const emailExists = await this.userRepo.existsByEmail(command.email);
    if (emailExists) {
      return AppResult.fail('An account with this email already exists.');
    }

    const passwordHash = await this.passwordService.hash(command.password);

    const user = await this.userRepo.create({
      email: command.email,
      passwordHash,
      displayName: command.displayName,
    });

    return AppResult.ok(user);
  }
}
