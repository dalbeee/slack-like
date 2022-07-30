import { forwardRef, Inject, Injectable } from '@nestjs/common';

import { ChannelService } from '@src/channel/channel.service';
import { UserRedisService } from '@src/user/user-redis.service';
import { SocketIoGateway } from './socketio.gateway';

@Injectable()
export class SocketIoOutboundService {
  constructor(
    @Inject(forwardRef(() => SocketIoGateway))
    private readonly socketGateway: SocketIoGateway,
    private readonly userRedisService: UserRedisService,
    private readonly channelService: ChannelService,
  ) {}

  async sendToClient(
    { messageKey, socketId }: { messageKey: string; socketId: string },
    data: unknown,
  ) {
    this.socketGateway.sendToClientBySocketId({ messageKey, socketId }, data);
    return;
  }

  async sendToUser(
    { messageKey, userId }: { messageKey: string; userId: string },
    data: unknown,
  ) {
    const sockets = await this.userRedisService.findSocketsByUserId(userId);
    sockets.forEach((socketId) => {
      this.socketGateway.sendToClientBySocketId({ messageKey, socketId }, data);
    });
    return;
  }

  async sendToChannel(
    { channelId, messageKey }: { messageKey: string; channelId: string },
    data: unknown,
  ) {
    const channelSubscribeUserIds = (
      await this.channelService.findChannelById(channelId)
    ).Users.map((user) => user.id);
    const connectedSocketIds = await this.userRedisService.findSocketByUserIds(
      channelSubscribeUserIds,
    );
    connectedSocketIds.forEach((socketId) => {
      this.socketGateway.sendToClientBySocketId({ messageKey, socketId }, data);
    });
    return;
  }
}
