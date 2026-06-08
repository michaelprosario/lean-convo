import { LoginUseCase } from './login.use-case';
import { LoginCommand } from '../../commands/login.command';
import { IUserRepository } from '../../interfaces/user.repository.interface';
import { IPasswordService } from '../../interfaces/password.service.interface';
import { ITokenService } from '../../interfaces/token.service.interface';
import { instance, mock, when, anything } from 'ts-mockito';
import { UserEntity } from '../../domain/user.entity';

describe('LoginUseCase', () => {
  let useCase: LoginUseCase;
  let userRepo: IUserRepository;
  let passwordService: IPasswordService;
  let tokenService: ITokenService;

  const user: UserEntity = {
    id: 'user-1',
    email: 'user@example.com',
    passwordHash: 'hash',
    displayName: 'Test User',
    createdAt: new Date(),
  };

  beforeEach(() => {
    userRepo = mock<IUserRepository>();
    passwordService = mock<IPasswordService>();
    tokenService = mock<ITokenService>();
    useCase = new LoginUseCase(instance(userRepo), instance(passwordService), instance(tokenService));
  });

  it('should fail when email is missing', async () => {
    const result = await useCase.execute(new LoginCommand('', 'pass'));
    expect(result.success).toBe(false);
  });

  it('should fail when user not found', async () => {
    when(userRepo.findByEmail('unknown@example.com')).thenResolve(null);
    const result = await useCase.execute(new LoginCommand('unknown@example.com', 'pass'));
    expect(result.success).toBe(false);
    expect(result.errorMessage).toMatch(/invalid/i);
  });

  it('should fail when password is incorrect', async () => {
    when(userRepo.findByEmail(user.email)).thenResolve(user);
    when(passwordService.compare('wrong', user.passwordHash)).thenResolve(false);
    const result = await useCase.execute(new LoginCommand(user.email, 'wrong'));
    expect(result.success).toBe(false);
  });

  it('should return token on valid credentials', async () => {
    when(userRepo.findByEmail(user.email)).thenResolve(user);
    when(passwordService.compare('correct', user.passwordHash)).thenResolve(true);
    when(tokenService.sign(anything())).thenReturn('jwt-token');

    const result = await useCase.execute(new LoginCommand(user.email, 'correct'));

    expect(result.success).toBe(true);
    expect(result.data?.accessToken).toBe('jwt-token');
    expect(result.data?.userId).toBe(user.id);
  });
});
