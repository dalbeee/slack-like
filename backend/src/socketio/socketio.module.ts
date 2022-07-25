import { Module } from '@nestjs/common';

import { MessageModule } from '@src/message/message.module';
import { UserModule } from '@src/user/user.module';
import { SocketIoGateway } from './socketio.gateway';
import { SocketIoInboudService } from './socketio-inbound.service';
import { SocketIoOutboundService } from './socketio-outbound.service';

@Module({
  imports: [UserModule, MessageModule],
  providers: [SocketIoGateway, SocketIoInboudService, SocketIoOutboundService],
  exports: [SocketIoGateway, SocketIoInboudService, SocketIoOutboundService],
})
export class SocketIoModule {}
