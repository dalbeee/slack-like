import {
  ClassSerializerInterceptor,
  Module,
  ValidationPipe,
} from '@nestjs/common';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';

import { AppController } from '@src/app.controller';
import { AppService } from '@src/app.service';
import { UserModule } from '@src/user/user.module';
import { ChannelModule } from './channel/channel.module';
import { InvitationModule } from './invitation/invitation.module';
import { MessageModule } from './message/message.module';
import { SocketIOModule } from './socketio/socketio.module';
import { UploadModule } from './upload/upload.module';
import { WorkspaceModule } from './workspace/workspace.module';

@Module({
  imports: [
    InvitationModule,
    UserModule,
    UploadModule,
    WorkspaceModule,
    ChannelModule,
    MessageModule,
    SocketIOModule,
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
    AppService,
  ],
})
export class AppModule {}
