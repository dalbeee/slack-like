import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { ChannelService } from '@src/channel/channel.service';
import { MessageService } from '@src/message/message.service';
import { RedisService } from '@src/redis/redis.service';
import { ChannelMetadata } from '@src/socketio';
import { ChannelSpecificDto } from '@src/socketio/dto/channel-specific.dto';
import { UserService } from './user.service';

@Injectable()
export class UserRedisService {
  constructor(
    private readonly redisService: RedisService,
    private readonly userService: UserService,
    @Inject(forwardRef(() => MessageService))
    private readonly messageService: MessageService,
    private readonly channelService: ChannelService,
  ) {}

  // channel methods

  async _setChannelDataAt(
    channelDto: ChannelSpecificDto,
    { unreadMessageCount }: ChannelMetadata,
  ) {
    this.redisService.redis.hset(
      `user:${channelDto.userId}`,
      `workspaces.${channelDto.workspaceId}.${channelDto.channelId}.unreadMessageCount`,
      unreadMessageCount,
    );
    return await this.getChannelDataBy(channelDto);
  }

  async increaseUnreadMessageCount(channelDto: ChannelSpecificDto) {
    const count = await this.getChannelDataBy(channelDto);

    return await this._setChannelDataAt(channelDto, {
      unreadMessageCount: count.unreadMessageCount + 1,
    });
  }

  async setZeroUnreadMessageCount(channelDto: ChannelSpecificDto) {
    return await this._setChannelDataAt(channelDto, {
      unreadMessageCount: 0,
    });
  }

  async getChannelDataBy({
    userId,
    workspaceId,
    channelId,
  }: ChannelSpecificDto) {
    const result = await this.redisService.redis.hget(
      `user:${userId}`,
      `workspaces.${workspaceId}.${channelId}.unreadMessageCount`,
    );
    return { unreadMessageCount: result ? parseInt(result) : 0 };
  }

  async getChannelDataAll(userId: string, workspaceId: string) {
    const result = {};
    const channels =
      await this.userService.findSubscribedChannelsByWorkspaceIdAndUserId(
        userId,
        workspaceId,
      );
    await Promise.all(
      channels.map(async (channel) => {
        const data = await this.getChannelDataBy({
          userId,
          workspaceId,
          channelId: channel.id,
        });
        result[channel.id] = data;
      }),
    );
    return result;
  }

  // socket methods

  async setSocketAt(userId: string, socketId: string) {
    const user = await this.userService.findUserById(userId);
    if (!user) throw new NotFoundException();
    await this.redisService.redis.sadd(`user:${userId}:socket`, socketId);
    return this.findSocketByUserId(userId);
  }

  async findSocketByUserId(userId: string) {
    return this.redisService.redis.smembers(`user:${userId}:socket`);
  }

  async findSocketByUserIds(userIds: string[]) {
    const socketIds = await Promise.all(
      userIds.map((userId) => this.findSocketByUserId(userId)),
    );
    return socketIds.flat();
  }

  async findSocketByMessageAuthor(messageId: string) {
    const message = await this.messageService.findById(messageId);
    if (!message) throw new NotFoundException();
    return await this.findSocketByUserId(message.userId);
  }

  async removeSocketAt(userId: string, socketId: string) {
    const user = await this.userService.findUserById(userId);
    if (!user) throw new NotFoundException();
    await this.redisService.redis.srem(`user:${userId}:socket`, socketId);
    return this.findSocketByUserId(userId);
  }
}
