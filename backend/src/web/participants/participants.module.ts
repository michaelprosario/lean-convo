import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Participant, ParticipantSchema } from '../../infra/schemas/participant.schema';
import { Session, SessionSchema } from '../../infra/schemas/session.schema';
import { ParticipantRepository } from '../../infra/repositories/participant.repository';
import { SessionRepository } from '../../infra/repositories/session.repository';
import { JoinSessionUseCase } from '../../core/use-cases/participants/join-session.use-case';
import { PARTICIPANT_REPOSITORY } from '../../core/interfaces/participant.repository.interface';
import { SESSION_REPOSITORY } from '../../core/interfaces/session.repository.interface';
import { ParticipantsController } from './participants.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Participant.name, schema: ParticipantSchema },
      { name: Session.name, schema: SessionSchema },
    ]),
  ],
  controllers: [ParticipantsController],
  providers: [
    { provide: PARTICIPANT_REPOSITORY, useClass: ParticipantRepository },
    { provide: SESSION_REPOSITORY, useClass: SessionRepository },
    JoinSessionUseCase,
  ],
  exports: [PARTICIPANT_REPOSITORY],
})
export class ParticipantsModule {}
