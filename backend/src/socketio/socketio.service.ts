import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { UserJwtPayload } from '@src/auth/types';
import { MessageService } from '@src/message/message.service';
import { RedisService } from '@src/redis/redis.service';
import { UserRedisService } from '@src/user/user.redis-service';
import { SocketReactionData, ChannelMetadata } from '.';
import { MessageCreateDto } from './dto/message-create.dto';
import { MessageDeleteDto } from './dto/message-delete.dto';
import { SocketInfo } from './dto/socket-info.dto';
import { SocketIOGateway } from './socketio.gateway';

@Injectable()
export class SocketIOService {
  constructor(
    private readonly messageService: MessageService,
    @Inject(forwardRef(() => SocketIOGateway))
    private readonly socketGateway: SocketIOGateway,
    private readonly redisService: RedisService,
    private readonly userRedisService: UserRedisService,
  ) {}

  async _createReaction(user: UserJwtPayload, socketInfo: SocketInfo) {
    const data = await this.redisService.hGet(user.id, socketInfo.channelId);
    const result: SocketReactionData = {
      type: 'reaction',
      channelId: socketInfo.channelId,
      data: data as ChannelMetadata,
    };
    return result;
  }

  async saveMessage(user: UserJwtPayload, message: MessageCreateDto) {
    const result = await this.messageService.createMessage(user, {
      channelId: message.socketInfo.channelId,
      workspaceId: message.socketInfo.workspaceId,
      content: message.message,
    });
    const response = {
      type: 'message.create',
      data: result,
    };
    // const r = await this.redisService.hGet(
    //   user.id,
    //   message.socketInfo.channelId,
    // );
    // const data = await this.redisService.hAppend(
    //   user.id,
    //   message.socketInfo.channelId,
    //   { latestMessageId: result.id },
    // );

    await this.userRedisService.saveChannelDataAt(
      {
        userId: user.id,
        channelId: message.socketInfo.channelId,
        workspaceId: message.socketInfo.workspaceId,
      },
      { latestMessageId: result.id },
    );

    const reaction = {
      type: 'reaction',
      channelId: message.socketInfo.channelId,
      data: { lastCheckMessageId: result.id },
    };
    return { response, reaction };
  }

  async deleteMessage(user: UserJwtPayload, message: MessageDeleteDto) {
    const result = await this.messageService.deleteMessage(
      user,
      message.messageId,
    );
    if (!result) throw new BadRequestException();
    const response = {
      type: 'message.delete',
      data: { messageId: message.messageId },
    };
    return { response };
  }

  async findMessageAuthor(messageId: string) {
    const message = await this.messageService.findById(messageId);
    if (!message) throw new NotFoundException();
    this.socketGateway.sendReactionToUser(message.userId, {
      target: 'mention',
      id: 'a',
    });
  }
}
