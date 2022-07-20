import { Injectable, NotFoundException } from '@nestjs/common';

import { ChannelService } from '@src/channel/channel.service';
import { MessageService } from '@src/message/message.service';
import { RedisService } from '@src/redis/redis.service';

@Injectable()
export class UserRedisService {
  constructor(
    private readonly redisService: RedisService,
    private readonly channelService: ChannelService,
    private readonly messageService: MessageService,
  ) {}

  // channel methods

  async setChannelDataAt(
    {
      channelId,
      workspaceId,
      userId,
    }: { userId: string; workspaceId: string; channelId: string },
    data: {
      latestMessageId?: string;
      lastCheckMessageId?: string;
    },
  ) {
    Object.keys(data).forEach((field) => {
      this.redisService.redis.hset(
        `user:${userId}`,
        `workspaces.${workspaceId}.${channelId}.${field}`,
        data[field],
      );
    });
    return true;
  }

  async getChannelDataBy({
    userId,
    workspaceId,
    channelId,
  }: {
    userId: string;
    workspaceId: string;
    channelId: string;
  }) {
    const result = {};
    const kies = ['latestMessageId', 'lastCheckMessageId'];
    await Promise.all(
      kies.map(async (key) => {
        const data = await this.redisService.redis.hget(
          `user:${userId}`,
          `workspaces.${workspaceId}.${channelId}.${key}`,
        );
        result[key] = data;
      }),
    );
    return result;
  }

  async getChannelDataAll(userId: string, workspaceId: string) {
    const result = {};
    const channels = await this.channelService.findchannelsByWorkspaceId(
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

  async _findSocketByUserId(userId: string) {
    return this.redisService.redis.hget(`user:${userId}`, 'socket');
  }

  async setSocketAt(userId: string, socketId: string) {
    return this.redisService.redis.hset(`user:${userId}`, 'socket', socketId);
  }

  async findSocketByMessageAuthor(messageId: string) {
    const message = await this.messageService.findById(messageId);
    if (!message) throw new NotFoundException();
    return await this._findSocketByUserId(message.userId);
  }
}
