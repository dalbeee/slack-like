import { forwardRef, Inject, Injectable } from '@nestjs/common';

import { UserJwtPayload } from '@src/auth/types';
import { MessageReactionCreateDto } from '@src/message/dto/message-reaction-create.dto';
import { MessageReactionService } from '@src/message/message-reaction.service';
import { UserRedisService } from '@src/user/user-redis.service';
import { SocketWrapper } from './dto/socket-wrapper.dto';
import { SocketIoOutboundService } from './socketio-outbound.service';

@Injectable()
export class SocketIoMessageReactionInboundService {
  constructor(
    @Inject(forwardRef(() => SocketIoOutboundService))
    private readonly socketOutboundService: SocketIoOutboundService,
    private readonly messageReactionService: MessageReactionService,
    private readonly userRedisService: UserRedisService,
  ) {}

  async createItem(
    user: UserJwtPayload,
    data: SocketWrapper & MessageReactionCreateDto,
  ) {
    const result = await this.messageReactionService.createItem(user, data);

    this.userRedisService.increaseUnreadMessageCountByChannelSubscribers({
      workspaceId: data.socketInfo.workspaceId,
      channelId: data.socketInfo.channelId,
    });

    this.socketOutboundService.sendToChannel(
      {
        messageKey:
          result.action === 'create'
            ? 'message_reaction.create'
            : 'message_reaction.delete',
        channelId: data.socketInfo.channelId,
      },
      result.reaction,
    );
    return result;
  }
}
