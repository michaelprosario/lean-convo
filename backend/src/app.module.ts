import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './web/auth/auth.module';
import { SessionsModule } from './web/sessions/sessions.module';
import { TopicsModule } from './web/topics/topics.module';
import { ParticipantsModule } from './web/participants/participants.module';
import { TopicsRealtimeModule } from './web/topics-realtime/topics-realtime.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/',
      exclude: ['/api/(.*)'],
    }),
    MongooseModule.forRoot(
      process.env.MONGODB_URI ?? 'mongodb://admin:password@localhost:27017/lean-convo?authSource=admin',
    ),
    AuthModule,
    SessionsModule,
    TopicsModule,
    ParticipantsModule,
    TopicsRealtimeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
