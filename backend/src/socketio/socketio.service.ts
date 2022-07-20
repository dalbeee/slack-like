import { BadRequestException, Injectable } from '@nestjs/common';

import { UserJwtPayload } from '@src/auth/types';
import { MessageService } from '@src/message/message.service';
import { UserRedisService } from '@src/user/user.redis-service';
import { ChannelMetadata, SocketMessageData, SocketChannelData } from '.';
import { ChannelMetadataUpdateDto } from './dto/channel-metadata-update.dto';
import { MessageCreateDto } from './dto/message-create.dto';
import { MessageDeleteDto } from './dto/message-delete.dto';

@Injectable()
export class SocketIOService {
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

    await this.userRedisService.setChannelDataAt(
      {
        userId: user.id,
        channelId: data.socketInfo.channelId,
        workspaceId: data.socketInfo.workspaceId,
      },
      { latestMessageId: result.id },
    );

    const channelData: SocketChannelData = {
      type: 'channel',
      channelId: data.socketInfo.channelId,
      data: { lastCheckMessageId: result.id } as ChannelMetadata,
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

  async updateChannelMetadata(
    user: UserJwtPayload,
    data: ChannelMetadataUpdateDto,
  ) {
    return this.userRedisService.setChannelDataAt(
      {
        workspaceId: data.socketInfo.workspaceId,
        channelId: data.socketInfo.channelId,
        userId: user.id,
      },
      { lastCheckMessageId: data.lastCheckMesasgeId },
    );
  }
}
