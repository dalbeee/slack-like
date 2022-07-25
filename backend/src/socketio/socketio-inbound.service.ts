import { BadRequestException, Injectable } from '@nestjs/common';

import { UserJwtPayload } from '@src/auth/types';
import { MessageService } from '@src/message/message.service';
import { UserRedisService } from '@src/user/user-redis.service';
import { ChannelMetadata, SocketMessageData, SocketChannelData } from '.';
import { ChannelSpecificDto } from './dto/channel-specific.dto';
import { MessageCreateDto } from './dto/message-create.dto';
import { MessageDeleteDto } from './dto/message-delete.dto';

@Injectable()
export class SocketIoInboudService {
  constructor(
    private readonly messageService: MessageService,
    private readonly userRedisService: UserRedisService,
  ) {}

  async saveMessage(user: UserJwtPayload, data: MessageCreateDto) {
    const result = await this.messageService.createMessage(user, {
      channelId: data.socketInfo.channelId,
      workspaceId: data.socketInfo.workspaceId,
      content: data.message,
    });
    const messageData: SocketMessageData = {
      type: 'message.create',
      data: result,
    };

    const unreadMessageCount =
      await this.userRedisService.increaseUnreadMessageCount({
        userId: user.id,
        channelId: data.socketInfo.channelId,
        workspaceId: data.socketInfo.workspaceId,
      });

    const channelData: SocketChannelData = {
      type: 'channel.setZeroUnreadMessageCount',
      channelId: data.socketInfo.channelId,
      data: unreadMessageCount as ChannelMetadata,
    };
    return { messageData, channelData };
  }

  async deleteMessage(user: UserJwtPayload, data: MessageDeleteDto) {
    const result = await this.messageService.deleteMessage(
      user,
      data.messageId,
    );
    if (!result) throw new BadRequestException();
    const messageData: SocketMessageData = {
      type: 'message.delete',
      data: { messageId: data.messageId },
    };
    return { messageData };
  }

  increaseUnreadMessageCount(channelDto: ChannelSpecificDto) {
    return this.userRedisService.increaseUnreadMessageCount(channelDto);
  }

  setZeroUnreadMessageCount(channelDto: ChannelSpecificDto) {
    return this.userRedisService.setZeroUnreadMessageCount(channelDto);
  }
}
