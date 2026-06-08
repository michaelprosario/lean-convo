import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { CreateAccountUseCase } from '../../core/use-cases/auth/create-account.use-case';
import { LoginUseCase } from '../../core/use-cases/auth/login.use-case';
import { CreateAccountDto } from './dto/create-account.dto';
import { LoginDto } from './dto/login.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { CreateAccountCommand } from '../../core/commands/create-account.command';
import { LoginCommand } from '../../core/commands/login.command';
import { AppResult } from '../../core/results/app-result';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly createAccountUseCase: CreateAccountUseCase,
    private readonly loginUseCase: LoginUseCase,
  ) {}

  @Post('create-account')
  @HttpCode(HttpStatus.CREATED)
  async createAccount(@Body() dto: CreateAccountDto): Promise<AppResult<UserResponseDto>> {
    const command = new CreateAccountCommand(dto.email, dto.password, dto.displayName);
    const result = await this.createAccountUseCase.execute(command);

    if (!result.success) {
      return AppResult.fail(result.errorMessage!);
    }

    const user = result.data!;
    const responseDto: UserResponseDto = {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      createdAt: user.createdAt,
    };
    return AppResult.ok(responseDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto): Promise<AppResult<LoginResponseDto>> {
    const command = new LoginCommand(dto.email, dto.password);
    const result = await this.loginUseCase.execute(command);

    if (!result.success) {
      return AppResult.fail(result.errorMessage!);
    }

    const loginResponseDto: LoginResponseDto = {
      accessToken: result.data!.accessToken,
      userId: result.data!.userId,
      displayName: result.data!.displayName,
      email: result.data!.email,
    };
    return AppResult.ok(loginResponseDto);
  }
}
