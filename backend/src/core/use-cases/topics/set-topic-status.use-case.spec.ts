import { anything, instance, mock, verify, when } from 'ts-mockito';
import { SetTopicStatusUseCase } from './set-topic-status.use-case';
import type { ITopicRepository } from '../../interfaces/topic.repository.interface';
import type { ISessionRepository } from '../../interfaces/session.repository.interface';
import { SetTopicStatusCommand } from '../../commands/set-topic-status.command';
import { TopicEntity, TopicStatus } from '../../domain/topic.entity';
import { SessionEntity } from '../../domain/session.entity';

describe('SetTopicStatusUseCase', () => {
  let topicRepo: ITopicRepository;
  let sessionRepo: ISessionRepository;
  let useCase: SetTopicStatusUseCase;

  const session: SessionEntity = {
    id: 'sess-1',
    title: 'Session',
    description: '',
    organizerId: 'org-1',
    joinCode: 'ABCD12',
    maxUpvotesPerParticipant: 3,
    createdAt: new Date(),
  };

  const targetTopic: TopicEntity = {
    id: 'topic-1',
    sessionId: 'sess-1',
    title: 'Target',
    description: '',
    proposedBy: 'p1',
    upvoteCount: 1,
    upvotedBy: [],
    status: TopicStatus.Todo,
    createdAt: new Date(),
  };

  const otherActiveTopic: TopicEntity = {
    id: 'topic-2',
    sessionId: 'sess-1',
    title: 'Other active',
    description: '',
    proposedBy: 'p2',
    upvoteCount: 3,
    upvotedBy: [],
    status: TopicStatus.Active,
    createdAt: new Date(),
  };

  beforeEach(() => {
    topicRepo = mock<ITopicRepository>();
    sessionRepo = mock<ISessionRepository>();
    useCase = new SetTopicStatusUseCase(instance(topicRepo), instance(sessionRepo));
  });

  it('fails when organizer does not own session', async () => {
    when(topicRepo.findById('topic-1')).thenResolve(targetTopic);
    when(sessionRepo.findById('sess-1')).thenResolve({ ...session, organizerId: 'org-2' });

    const result = await useCase.execute(
      new SetTopicStatusCommand('topic-1', 'org-1', TopicStatus.Done),
    );

    expect(result.success).toBe(false);
    expect(result.errorMessage).toBe('You do not have access to change this topic status.');
  });

  it('sets target topic active and demotes other active topics to todo', async () => {
    when(topicRepo.findById('topic-1')).thenResolve(targetTopic);
    when(sessionRepo.findById('sess-1')).thenResolve(session);
    when(topicRepo.findBySessionId('sess-1')).thenResolve([targetTopic, otherActiveTopic]);
    when(topicRepo.update('topic-2', anything())).thenResolve({ ...otherActiveTopic, status: TopicStatus.Todo });
    when(topicRepo.update('topic-1', anything())).thenResolve({ ...targetTopic, status: TopicStatus.Active });

    const result = await useCase.execute(
      new SetTopicStatusCommand('topic-1', 'org-1', TopicStatus.Active),
    );

    expect(result.success).toBe(true);
    expect(result.data?.status).toBe(TopicStatus.Active);
    verify(topicRepo.update('topic-2', anything())).once();
  });
});
