import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Message } from '@prisma/client';

import { UserJwtPayload } from '@src/auth/types';
import { ChannelService } from '@src/channel/channel.service';
import { MessageService } from '@src/message/message.service';
import { UserRedisService } from '@src/user/user-redis.service';
import { SocketMessageCreate, SocketMessageDelete } from '.';
import { ChannelSpecificDto } from './dto/channel-specific.dto';
import { MessageCreateDto } from './dto/message-create.dto';
import { MessageDeleteDto } from './dto/message-delete.dto';
import { SocketIoOutboundService } from './socketio-outbound.service';

@Injectable()
export class SocketIoInboudService {
  constructor(
    private readonly messageService: MessageService,
    private readonly userRedisService: UserRedisService,
    private readonly channelService: ChannelService,
    @Inject(forwardRef(() => SocketIoOutboundService))
    private readonly socketOutboundService: SocketIoOutboundService,
  ) {}

  async saveMessage(user: UserJwtPayload, data: MessageCreateDto) {
    const updateChannelMetadataByUserIds = (userIds: string[]) =>
      userIds.forEach((userId) => {
        this.userRedisService.increaseUnreadMessageCount({
          userId,
          channelId: data.socketInfo.channelId,
          workspaceId: data.socketInfo.workspaceId,
        });
      });
    const sendMessageToClients = async (
      userIds: string[],
      message: Message,
    ) => {
      userIds.map(async (userId) => {
        const socketIds = await this.userRedisService.findSocketsByUserId(
          userId,
        );
        const metadata = await this.userRedisService.getChannelDataBy({
          workspaceId: data.socketInfo.workspaceId,
          channelId: data.socketInfo.channelId,
          userId,
        });
        socketIds.forEach((socketId) => {
          return this.socketOutboundService.sendToClient(
            {
              messageKey: 'message.create',
              socketId,
            },
            { data: message, metadata } as SocketMessageCreate,
          );
        });
      });
      return true;
    };

    const message = await this.messageService.createMessage(user, {
      channelId: data.socketInfo.channelId,
      workspaceId: data.socketInfo.workspaceId,
      content: data.message,
    });
    const channelSubscribeUserIds = (
      await this.channelService.findChannelById(data.socketInfo.channelId)
    ).Users.map((user) => user.id);
    updateChannelMetadataByUserIds(channelSubscribeUserIds);

    return sendMessageToClients(channelSubscribeUserIds, message); 
  }
    
  async deleteMessage(user: UserJwtPayload, data: MessageDeleteDto) {
    const result = await this.messageService.deleteMessage(
      user,
      data.messageId,
    );
    if (!result) throw new BadRequestException();

    const messageData: SocketMessageDelete = {
      messageId: data.messageId,
    };
    const channelSubscribeUserIds = (
      await this.channelService.findChannelById(data.socketInfo.channelId)
    ).Users.map((user) => user.id);
    const socketIds = await this.userRedisService.findSocketByUserIds(
      channelSubscribeUserIds,
    );
    socketIds.forEach((socketId) => {
      this.socketOutboundService.sendToClient(
        {
          messageKey: 'message.delete',
          socketId,
        },
        messageData,
      );
    });
    return;
  }

  increaseUnreadMessageCount(channelDto: ChannelSpecificDto) {
    return this.userRedisService.increaseUnreadMessageCount(channelDto);
  }

  setZeroUnreadMessageCount(channelDto: ChannelSpecificDto) {
    return this.userRedisService.setZeroUnreadMessageCount(channelDto);
  }
}
