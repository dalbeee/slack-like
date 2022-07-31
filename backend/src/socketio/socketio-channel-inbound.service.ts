import { forwardRef, Inject, Injectable } from '@nestjs/common';

import { ChannelService } from '@src/channel/channel.service';
import { ChannelCreateDto } from '@src/channel/dto/channel-create.dto';
import { SocketIoOutboundService } from './socketio-outbound.service';

@Injectable()
export class SocketIoChannelInboundService {
  constructor(
    @Inject(forwardRef(() => SocketIoOutboundService))
    private readonly socketIoOutboundService: SocketIoOutboundService,
    private readonly channelService: ChannelService,
  ) {}

  async createChannel(userId: string, dto: ChannelCreateDto) {
    const result = await this.channelService.createChannel(dto);
    this.socketIoOutboundService.sendToUser(
      { messageKey: 'channel.create', userId },
      result,
    );
    return result;
  }

  async subscribeChannel(userId: string, channelId: string) {
    const result = await this.channelService.subscribeChannel(
      userId,
      channelId,
    );
    this.socketIoOutboundService.sendToUser(
      { messageKey: 'channel.subscribe', userId },
      result,
    );
    return result;
  }

  async unsubscribeChannel(userId: string, channelId: string) {
    const result = await this.channelService.unsubscribeChannel(
      userId,
      channelId,
    );
    this.socketIoOutboundService.sendToUser(
      { messageKey: 'channel.unsubscribe', userId },
      result,
    );
    return result;
  }
}
