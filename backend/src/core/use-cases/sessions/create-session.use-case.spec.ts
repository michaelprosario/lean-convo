import { CreateSessionUseCase } from './create-session.use-case';
import { CreateSessionCommand } from '../../commands/create-session.command';
import { ISessionRepository } from '../../interfaces/session.repository.interface';
import { instance, mock, when, anything } from 'ts-mockito';
import { SessionEntity } from '../../domain/session.entity';

describe('CreateSessionUseCase', () => {
  let useCase: CreateSessionUseCase;
  let sessionRepo: ISessionRepository;

  const session: SessionEntity = {
    id: 'sess-1',
    title: 'Sprint Retro',
    description: 'Team retro',
    organizerId: 'org-1',
    joinCode: 'ABC123',
    maxUpvotesPerParticipant: 3,
    createdAt: new Date(),
  };

  beforeEach(() => {
    sessionRepo = mock<ISessionRepository>();
    useCase = new CreateSessionUseCase(instance(sessionRepo));
  });

  it('should fail when title is empty', async () => {
    const result = await useCase.execute(new CreateSessionCommand('org-1', '', 'desc', 3));
    expect(result.success).toBe(false);
  });

  it('should fail when organizerId is missing', async () => {
    const result = await useCase.execute(new CreateSessionCommand('', 'Title', 'desc', 3));
    expect(result.success).toBe(false);
  });

  it('should fail when maxUpvotes is less than 1', async () => {
    const result = await useCase.execute(new CreateSessionCommand('org-1', 'Title', 'desc', 0));
    expect(result.success).toBe(false);
  });

  it('should create session on valid input', async () => {
    when(sessionRepo.create(anything())).thenResolve(session);
    const result = await useCase.execute(new CreateSessionCommand('org-1', 'Sprint Retro', 'Team retro', 3));
    expect(result.success).toBe(true);
    expect(result.data?.title).toBe('Sprint Retro');
  });
});
