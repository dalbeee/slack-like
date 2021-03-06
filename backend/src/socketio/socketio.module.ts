import { Module } from '@nestjs/common';

import { MessageModule } from '@src/message/message.module';
import { UserModule } from '@src/user/user.module';
import { SocketIoGateway } from './socketio.gateway';
import { SocketIoInboudService } from './socketio-inbound.service';
import { SocketIoOutboundService } from './socketio-outbound.service';
import { ChannelModule } from '@src/channel/channel.module';
import { SocketIoChannelInboundService } from './socketio-channel-inbound.service';
import { SocketIoMessageInboundService } from './socketio-message-inbound.service';
import { SocketIoMessageReactionInboundService } from './socketio-message-reaction-inbound.service';

@Module({
  imports: [UserModule, MessageModule, ChannelModule],
  providers: [
    SocketIoGateway,
    SocketIoInboudService,
    SocketIoOutboundService,
    SocketIoChannelInboundService,
    SocketIoMessageInboundService,
    SocketIoMessageReactionInboundService,
  ],
  exports: [SocketIoOutboundService],
})
export class SocketIoModule {}
