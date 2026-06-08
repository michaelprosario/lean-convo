import { instance, mock, when, anything } from 'ts-mockito';
import { EditSessionUseCase } from './edit-session.use-case';
import type { ISessionRepository } from '../../interfaces/session.repository.interface';
import { EditSessionCommand } from '../../commands/edit-session.command';
import { SessionEntity } from '../../domain/session.entity';

describe('EditSessionUseCase', () => {
  let sessionRepo: ISessionRepository;
  let useCase: EditSessionUseCase;

  const existingSession: SessionEntity = {
    id: 'sess-1',
    title: 'Original title',
    description: 'Original description',
    organizerId: 'org-1',
    joinCode: 'JOIN01',
    maxUpvotesPerParticipant: 3,
    createdAt: new Date(),
  };

  beforeEach(() => {
    sessionRepo = mock<ISessionRepository>();
    useCase = new EditSessionUseCase(instance(sessionRepo));
  });

  it('fails when title is missing', async () => {
    const result = await useCase.execute(
      new EditSessionCommand('sess-1', 'org-1', '', 'x', 3),
    );

    expect(result.success).toBe(false);
    expect(result.errorMessage).toBe('Session title is required.');
  });

  it('fails when organizer does not own session', async () => {
    when(sessionRepo.findById('sess-1')).thenResolve(existingSession);

    const result = await useCase.execute(
      new EditSessionCommand('sess-1', 'org-2', 'Updated', 'x', 3),
    );

    expect(result.success).toBe(false);
    expect(result.errorMessage).toBe('You do not have access to edit this session.');
  });

  it('updates session when command is valid', async () => {
    const updated: SessionEntity = {
      ...existingSession,
      title: 'Updated title',
      description: 'Updated description',
      maxUpvotesPerParticipant: 5,
    };

    when(sessionRepo.findById('sess-1')).thenResolve(existingSession);
    when(sessionRepo.update('sess-1', anything())).thenResolve(updated);

    const result = await useCase.execute(
      new EditSessionCommand('sess-1', 'org-1', 'Updated title', 'Updated description', 5),
    );

    expect(result.success).toBe(true);
    expect(result.data?.title).toBe('Updated title');
    expect(result.data?.maxUpvotesPerParticipant).toBe(5);
  });
});
