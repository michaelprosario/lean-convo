import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  @Get()
  getHello(): string {
    // redirect to index.html
    return '<script>window.location.href="/index.html"</script>';
  }

  @Get('health')
  checkHealth() {
    const isDbConnected = this.connection.readyState === 1;
    const health = {
      status: isDbConnected ? 'ok' : 'error',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      checks: {
        database: isDbConnected ? 'up' : 'down',
      },
    };

    if (!isDbConnected) {
      throw new ServiceUnavailableException(health);
    }
    return health;
  }
}
