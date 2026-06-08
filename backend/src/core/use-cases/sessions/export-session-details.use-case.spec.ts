import { instance, mock, when } from 'ts-mockito';
import { ExportSessionDetailsUseCase } from './export-session-details.use-case';
import type { ISessionRepository } from '../../interfaces/session.repository.interface';
import type { ITopicRepository } from '../../interfaces/topic.repository.interface';
import { SessionEntity } from '../../domain/session.entity';
import { TopicEntity, TopicStatus } from '../../domain/topic.entity';

describe('ExportSessionDetailsUseCase', () => {
  let sessionRepo: ISessionRepository;
  let topicRepo: ITopicRepository;
  let useCase: ExportSessionDetailsUseCase;

  const session: SessionEntity = {
    id: 'sess-1',
    title: 'Retro',
    description: 'desc',
    organizerId: 'org-1',
    joinCode: 'ABC123',
    maxUpvotesPerParticipant: 3,
    createdAt: new Date(),
  };

  const topics: TopicEntity[] = [
    {
      id: 'topic-1',
      sessionId: 'sess-1',
      title: 'One',
      description: '',
      proposedBy: 'p1',
      upvoteCount: 2,
      upvotedBy: ['p2'],
      status: TopicStatus.Todo,
      createdAt: new Date(),
    },
    {
      id: 'topic-2',
      sessionId: 'sess-1',
      title: 'Two',
      description: '',
      proposedBy: 'p3',
      upvoteCount: 5,
      upvotedBy: ['p1'],
      status: TopicStatus.Active,
      createdAt: new Date(),
    },
  ];

  beforeEach(() => {
    sessionRepo = mock<ISessionRepository>();
    topicRepo = mock<ITopicRepository>();
    useCase = new ExportSessionDetailsUseCase(instance(sessionRepo), instance(topicRepo));
  });

  it('fails when organizer does not own session', async () => {
    when(sessionRepo.findById('sess-1')).thenResolve(session);

    const result = await useCase.execute('sess-1', 'org-2');

    expect(result.success).toBe(false);
    expect(result.errorMessage).toBe('You do not have access to export this session.');
  });

  it('returns session and sorted topics for organizer', async () => {
    when(sessionRepo.findById('sess-1')).thenResolve(session);
    when(topicRepo.findBySessionId('sess-1')).thenResolve(topics);

    const result = await useCase.execute('sess-1', 'org-1');

    expect(result.success).toBe(true);
    expect(result.data?.session.id).toBe('sess-1');
    expect(result.data?.topics[0].id).toBe('topic-2');
  });
});
