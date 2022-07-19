import { Injectable } from '@nestjs/common';

import { RedisService } from '@src/redis/redis.service';

@Injectable()
export class UserRedisService {
  constructor(private readonly redisService: RedisService) {}

  saveChannelData = async (
    {
      channelId,
      workspaceId,
      userId,
    }: { userId: string; workspaceId: string; channelId: string },
    data: {
      latestMessageId: string;
      lastCheckMessageId: string;
    },
  ) => {
    Object.keys(data).forEach((field) => {
      this.redisService.redis.hset(
        `user:${userId}`,
        `workspaces.${workspaceId}.${channelId}.${field}`,
        data[field],
      );
    });
    return true;
  };

  getChannelData = async ({
    userId,
    workspaceId,
    channelId,
  }: {
    userId: string;
    workspaceId: string;
    channelId: string;
  }) => {
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
  };
}
