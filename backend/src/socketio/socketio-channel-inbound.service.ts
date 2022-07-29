import { forwardRef, Inject, Injectable } from '@nestjs/common';

import { ChannelService } from '@src/channel/channel.service';
import { ChannelCreateDto } from '@src/channel/dto/channel-create.dto';
import { UserRedisService } from '@src/user/user-redis.service';
import { SocketIoOutboundService } from './socketio-outbound.service';

@Injectable()
export class SocketIoChannelInboundService {
  constructor(
    @Inject(forwardRef(() => SocketIoOutboundService))
    private readonly socketIoOutboundService: SocketIoOutboundService,
    private readonly channelService: ChannelService,
    private readonly userRedisService: UserRedisService,
  ) {}

  async createChannel(userId: string, dto: ChannelCreateDto) {
    const result = await this.channelService.createChannel(dto);
    const userSockets = await this.userRedisService.findSocketsByUserId(userId);
    userSockets.forEach((socketId) => {
      this.socketIoOutboundService.sendToClient(
        { messageKey: 'channel.create', socketId },
        result,
      );
    });
  }

  async subscribeChannel(userId: string, channelId: string) {
    const result = await this.channelService.subscribeChannel(
      userId,
      channelId,
    );
    const userSockets = await this.userRedisService.findSocketsByUserId(userId);
    userSockets.forEach((socketId) => {
      this.socketIoOutboundService.sendToClient(
        { messageKey: 'channel.subscribe', socketId },
        result,
      );
    });
  }

  async unsubscribeChannel(userId: string, channelId: string) {
    const result = await this.channelService.unsubscribeChannel(
      userId,
      channelId,
    );
    const userSockets = await this.userRedisService.findSocketsByUserId(userId);
    userSockets.forEach((socketId) => {
      this.socketIoOutboundService.sendToClient(
        {
          messageKey: 'channel.unsubscribe',
          socketId,
        },
        result,
      );
    });
  }
}
