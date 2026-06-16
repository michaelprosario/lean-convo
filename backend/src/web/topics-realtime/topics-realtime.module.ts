import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TopicsModule } from '../topics/topics.module';
import { TopicsGateway } from './topics.gateway';
import { WsJwtService } from './auth/ws-jwt.service';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET', 'change-me-in-production'),
      }),
    }),
    TopicsModule,
  ],
  providers: [TopicsGateway, WsJwtService],
})
export class TopicsRealtimeModule {}
