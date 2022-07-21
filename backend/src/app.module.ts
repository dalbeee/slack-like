import {
  ClassSerializerInterceptor,
  Module,
  ValidationPipe,
} from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';

import { AppController } from '@src/app.controller';
import { AppService } from '@src/app.service';
import { UserModule } from '@src/user/user.module';
import { AuthModule } from './auth/auth.module';
import { AccessTokenAuthGuard } from './auth/guard/access-token.guard';
import { ChannelModule } from './channel/channel.module';
import { InvitationModule } from './invitation/invitation.module';
import { MessageModule } from './message/message.module';
import { RedisModule } from './redis/redis.module';
import { SocketIoModule } from './socketio/socketio.module';
import { UploadModule } from './upload/upload.module';
import { WorkspaceModule } from './workspace/workspace.module';

@Module({
  imports: [
    WorkspaceModule,
    ChannelModule,
    UserModule,
    InvitationModule,
    AuthModule,
    UploadModule,
    MessageModule,
    SocketIoModule,
    RedisModule,
  ],
  controllers: [AppController],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: ClassSerializerInterceptor },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    },
    { provide: APP_GUARD, useClass: AccessTokenAuthGuard },
    AppService,
  ],
})
export class AppModule {}
