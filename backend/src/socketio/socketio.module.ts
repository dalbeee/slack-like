import { Module } from '@nestjs/common';

import { MessageModule } from '@src/message/message.module';
import { UserModule } from '@src/user/user.module';
import { SocketIOController } from './socketio.controller';
import { SocketIOService } from './socketio.service';

@Module({
  imports: [MessageModule, UserModule],
  providers: [SocketIOController, SocketIOService],
})
export class SocketIOModule {}
