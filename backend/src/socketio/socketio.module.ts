import { Module } from '@nestjs/common';

import { MessageModule } from '@src/message/message.module';
import { RedisModule } from '@src/redis/redis.module';
import { UserModule } from '@src/user/user.module';
import { SocketIOGateway } from './socketio.gateway';
import { SocketIOService } from './socketio.service';

@Module({
  imports: [MessageModule, UserModule, RedisModule],
  providers: [SocketIOGateway, SocketIOService],
  exports: [SocketIOGateway],
})
export class SocketIOModule {}
