import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Session, SessionSchema } from '../../infra/schemas/session.schema';
import { SessionRepository } from '../../infra/repositories/session.repository';
import { CreateSessionUseCase } from '../../core/use-cases/sessions/create-session.use-case';
import { SESSION_REPOSITORY } from '../../core/interfaces/session.repository.interface';
import { SessionsController } from './sessions.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Session.name, schema: SessionSchema }]),
  ],
  controllers: [SessionsController],
  providers: [
    { provide: SESSION_REPOSITORY, useClass: SessionRepository },
    CreateSessionUseCase,
  ],
})
export class SessionsModule {}
