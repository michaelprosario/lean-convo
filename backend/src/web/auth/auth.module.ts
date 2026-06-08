import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { User, UserSchema } from '../../infra/schemas/user.schema';
import { UserRepository } from '../../infra/repositories/user.repository';
import { PasswordService } from '../../infra/services/password.service';
import { TokenService } from '../../infra/services/token.service';

import { CreateAccountUseCase } from '../../core/use-cases/auth/create-account.use-case';
import { LoginUseCase } from '../../core/use-cases/auth/login.use-case';

import { USER_REPOSITORY } from '../../core/interfaces/user.repository.interface';
import { PASSWORD_SERVICE } from '../../core/interfaces/password.service.interface';
import { TOKEN_SERVICE } from '../../core/interfaces/token.service.interface';

import { AuthController } from './auth.controller';
import { JwtStrategy } from '../strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET', 'change-me-in-production'),
        signOptions: { expiresIn: '7d' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    { provide: USER_REPOSITORY, useClass: UserRepository },
    { provide: PASSWORD_SERVICE, useClass: PasswordService },
    { provide: TOKEN_SERVICE, useClass: TokenService },
    CreateAccountUseCase,
    LoginUseCase,
    JwtStrategy,
  ],
})
export class AuthModule {}
