import { CreateAccountUseCase } from './create-account.use-case';
import { CreateAccountCommand } from '../../commands/create-account.command';
import { IUserRepository } from '../../interfaces/user.repository.interface';
import { IPasswordService } from '../../interfaces/password.service.interface';
import { instance, mock, when, anything, verify } from 'ts-mockito';
import { UserEntity } from '../../domain/user.entity';

describe('CreateAccountUseCase', () => {
  let useCase: CreateAccountUseCase;
  let userRepo: IUserRepository;
  let passwordService: IPasswordService;

  beforeEach(() => {
    userRepo = mock<IUserRepository>();
    passwordService = mock<IPasswordService>();
    useCase = new CreateAccountUseCase(instance(userRepo), instance(passwordService));
  });

  it('should return fail when email is missing', async () => {
    const result = await useCase.execute(new CreateAccountCommand('', 'pass', 'Name'));
    expect(result.success).toBe(false);
  });

  it('should return fail when email already exists', async () => {
    when(userRepo.existsByEmail('test@example.com')).thenResolve(true);
    const result = await useCase.execute(new CreateAccountCommand('test@example.com', 'pass', 'Name'));
    expect(result.success).toBe(false);
    expect(result.errorMessage).toMatch(/already exists/i);
  });

  it('should create account and return user on success', async () => {
    const email = 'new@example.com';
    const hash = 'hashedPass';
    const user: UserEntity = { id: '1', email, passwordHash: hash, displayName: 'Name', createdAt: new Date() };

    when(userRepo.existsByEmail(email)).thenResolve(false);
    when(passwordService.hash('pass')).thenResolve(hash);
    when(userRepo.create(anything())).thenResolve(user);

    const result = await useCase.execute(new CreateAccountCommand(email, 'pass', 'Name'));

    expect(result.success).toBe(true);
    expect(result.data?.email).toBe(email);
    verify(userRepo.create(anything())).once();
  });
});
