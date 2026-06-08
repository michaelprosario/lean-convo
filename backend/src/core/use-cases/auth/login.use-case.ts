import { Inject, Injectable } from '@nestjs/common';
import { LoginCommand } from '../../commands/login.command';
import type { IUserRepository } from '../../interfaces/user.repository.interface';
import { USER_REPOSITORY } from '../../interfaces/user.repository.interface';
import type { IPasswordService } from '../../interfaces/password.service.interface';
import { PASSWORD_SERVICE } from '../../interfaces/password.service.interface';
import type { ITokenService } from '../../interfaces/token.service.interface';
import { TOKEN_SERVICE } from '../../interfaces/token.service.interface';
import { AppResult } from '../../results/app-result';
import { LoginResult } from './login.result';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepo: IUserRepository,
    @Inject(PASSWORD_SERVICE) private readonly passwordService: IPasswordService,
    @Inject(TOKEN_SERVICE) private readonly tokenService: ITokenService,
  ) {}

  async execute(command: LoginCommand): Promise<AppResult<LoginResult>> {
    if (!command.email || !command.password) {
      return AppResult.fail('Email and password are required.');
    }

    const user = await this.userRepo.findByEmail(command.email);
    if (!user) {
      return AppResult.fail('Invalid email or password.');
    }

    const passwordValid = await this.passwordService.compare(command.password, user.passwordHash);
    if (!passwordValid) {
      return AppResult.fail('Invalid email or password.');
    }

    const accessToken = this.tokenService.sign({ sub: user.id, email: user.email });

    return AppResult.ok({
      accessToken,
      userId: user.id,
      displayName: user.displayName,
      email: user.email,
    });
  }
}
