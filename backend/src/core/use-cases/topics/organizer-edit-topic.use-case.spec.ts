import { instance, mock, when, anything } from 'ts-mockito';
import { OrganizerEditTopicUseCase } from './organizer-edit-topic.use-case';
import type { ITopicRepository } from '../../interfaces/topic.repository.interface';
import type { ISessionRepository } from '../../interfaces/session.repository.interface';
import { OrganizerEditTopicCommand } from '../../commands/organizer-edit-topic.command';
import { TopicEntity, TopicStatus } from '../../domain/topic.entity';
import { SessionEntity } from '../../domain/session.entity';

describe('OrganizerEditTopicUseCase', () => {
  let topicRepo: ITopicRepository;
  let sessionRepo: ISessionRepository;
  let useCase: OrganizerEditTopicUseCase;

  const topic: TopicEntity = {
    id: 'topic-1',
    sessionId: 'sess-1',
    title: 'Old',
    description: 'Old desc',
    proposedBy: 'participant-1',
    upvoteCount: 2,
    upvotedBy: [],
    status: TopicStatus.Todo,
    createdAt: new Date(),
  };

  const session: SessionEntity = {
    id: 'sess-1',
    title: 'Session',
    description: '',
    organizerId: 'org-1',
    joinCode: 'A1B2C3',
    maxUpvotesPerParticipant: 3,
    createdAt: new Date(),
  };

  beforeEach(() => {
    topicRepo = mock<ITopicRepository>();
    sessionRepo = mock<ISessionRepository>();
    useCase = new OrganizerEditTopicUseCase(instance(topicRepo), instance(sessionRepo));
  });

  it('fails when organizer does not own topic session', async () => {
    when(topicRepo.findById('topic-1')).thenResolve(topic);
    when(sessionRepo.findById('sess-1')).thenResolve({ ...session, organizerId: 'org-2' });

    const result = await useCase.execute(
      new OrganizerEditTopicCommand('topic-1', 'org-1', 'New', 'New desc'),
    );

    expect(result.success).toBe(false);
    expect(result.errorMessage).toBe('You do not have access to edit this topic.');
  });

  it('updates topic when organizer owns session', async () => {
    const updated: TopicEntity = { ...topic, title: 'New', description: 'New desc' };

    when(topicRepo.findById('topic-1')).thenResolve(topic);
    when(sessionRepo.findById('sess-1')).thenResolve(session);
    when(topicRepo.update('topic-1', anything())).thenResolve(updated);

    const result = await useCase.execute(
      new OrganizerEditTopicCommand('topic-1', 'org-1', 'New', 'New desc'),
    );

    expect(result.success).toBe(true);
    expect(result.data?.title).toBe('New');
  });
});
