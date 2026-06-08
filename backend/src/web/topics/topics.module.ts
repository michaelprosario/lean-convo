import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Topic, TopicSchema } from '../../infra/schemas/topic.schema';
import { Participant, ParticipantSchema } from '../../infra/schemas/participant.schema';
import { Session, SessionSchema } from '../../infra/schemas/session.schema';
import { TopicRepository } from '../../infra/repositories/topic.repository';
import { ParticipantRepository } from '../../infra/repositories/participant.repository';
import { SessionRepository } from '../../infra/repositories/session.repository';
import { ProposeTopicUseCase } from '../../core/use-cases/topics/propose-topic.use-case';
import { UpvoteTopicUseCase } from '../../core/use-cases/topics/upvote-topic.use-case';
import { EditTopicUseCase } from '../../core/use-cases/topics/edit-topic.use-case';
import { DeleteTopicUseCase } from '../../core/use-cases/topics/delete-topic.use-case';
import { GetSessionTopicsUseCase } from '../../core/use-cases/topics/get-session-topics.use-case';
import { OrganizerEditTopicUseCase } from '../../core/use-cases/topics/organizer-edit-topic.use-case';
import { SetTopicStatusUseCase } from '../../core/use-cases/topics/set-topic-status.use-case';
import { TOPIC_REPOSITORY } from '../../core/interfaces/topic.repository.interface';
import { PARTICIPANT_REPOSITORY } from '../../core/interfaces/participant.repository.interface';
import { SESSION_REPOSITORY } from '../../core/interfaces/session.repository.interface';
import { TopicsController } from './topics.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Topic.name, schema: TopicSchema },
      { name: Participant.name, schema: ParticipantSchema },
      { name: Session.name, schema: SessionSchema },
    ]),
  ],
  controllers: [TopicsController],
  providers: [
    { provide: TOPIC_REPOSITORY, useClass: TopicRepository },
    { provide: PARTICIPANT_REPOSITORY, useClass: ParticipantRepository },
    { provide: SESSION_REPOSITORY, useClass: SessionRepository },
    ProposeTopicUseCase,
    UpvoteTopicUseCase,
    EditTopicUseCase,
    DeleteTopicUseCase,
    GetSessionTopicsUseCase,
    OrganizerEditTopicUseCase,
    SetTopicStatusUseCase,
  ],
})
export class TopicsModule {}
