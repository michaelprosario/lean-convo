import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Session, SessionSchema } from '../../infra/schemas/session.schema';
import { Topic, TopicSchema } from '../../infra/schemas/topic.schema';
import { SessionRepository } from '../../infra/repositories/session.repository';
import { TopicRepository } from '../../infra/repositories/topic.repository';
import { CreateSessionUseCase } from '../../core/use-cases/sessions/create-session.use-case';
import { GetMySessionsUseCase } from '../../core/use-cases/sessions/get-my-sessions.use-case';
import { GetSessionByCodeUseCase } from '../../core/use-cases/sessions/get-session-by-code.use-case';
import { EditSessionUseCase } from '../../core/use-cases/sessions/edit-session.use-case';
import { ExportSessionDetailsUseCase } from '../../core/use-cases/sessions/export-session-details.use-case';
import { DeleteSessionUseCase } from '../../core/use-cases/sessions/delete-session.use-case';
import { SESSION_REPOSITORY } from '../../core/interfaces/session.repository.interface';
import { TOPIC_REPOSITORY } from '../../core/interfaces/topic.repository.interface';
import { SessionsController } from './sessions.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Session.name, schema: SessionSchema },
      { name: Topic.name, schema: TopicSchema },
    ]),
  ],
  controllers: [SessionsController],
  providers: [
    { provide: SESSION_REPOSITORY, useClass: SessionRepository },
    { provide: TOPIC_REPOSITORY, useClass: TopicRepository },
    CreateSessionUseCase,
    GetMySessionsUseCase,
    GetSessionByCodeUseCase,
    EditSessionUseCase,
    ExportSessionDetailsUseCase,
    DeleteSessionUseCase,
  ],
})
export class SessionsModule {}
