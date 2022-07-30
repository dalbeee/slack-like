import { forwardRef, Inject, Injectable } from '@nestjs/common';

import { UserJwtPayload } from '@src/auth/types';
import { MessageCreateDto } from '@src/message/dto/message-create.dto';
import { MessageDeleteDto } from '@src/message/dto/message-delete.dto';
import { MessageService } from '@src/message/message.service';
import { UserRedisService } from '@src/user/user-redis.service';
import { SocketWrapper } from './dto/socket-wrapper.dto';
import { SocketIoOutboundService } from './socketio-outbound.service';

@Injectable()
export class SocketIoMessageInboundService {
  constructor(
    @Inject(forwardRef(() => SocketIoOutboundService))
    private readonly socketOutboundService: SocketIoOutboundService,
    private readonly userRedisService: UserRedisService,
    private readonly messageService: MessageService,
  ) {}

  async createItem(
    user: UserJwtPayload,
    data: SocketWrapper & MessageCreateDto,
  ) {
    const result = await this.messageService.createItem(user, {
      channelId: data.socketInfo.channelId,
      workspaceId: data.socketInfo.workspaceId,
      content: data.content,
    });

    this.userRedisService.increaseUnreadMessageCountByChannelSubscribers({
      workspaceId: data.socketInfo.workspaceId,
      channelId: data.socketInfo.channelId,
    });

    this.socketOutboundService.sendToChannel(
      {
        messageKey: 'message.create',
        channelId: data.socketInfo.channelId,
      },
      result,
    );
    return result;
  }

  async deleteItem(
    user: UserJwtPayload,
    data: SocketWrapper & MessageDeleteDto,
  ) {
    const result = await this.messageService.deleteItem(user, data.messageId);

    this.socketOutboundService.sendToChannel(
      {
        messageKey: 'message.delete',
        channelId: data.socketInfo.channelId,
      },
      result,
    );
    return result;
  }
}
