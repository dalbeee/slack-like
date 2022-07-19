import { Test, TestingModule } from '@nestjs/testing';
import { RedisModule } from '@src/redis/redis.module';
import { RedisService } from '@src/redis/redis.service';
import { UserRedisService } from './user.redis-service';

let app: TestingModule;
let userRedisService: UserRedisService;
let redisService: RedisService;

beforeAll(async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [RedisModule],
    providers: [UserRedisService],
  }).compile();
  app = await moduleRef.init();
  userRedisService = app.get(UserRedisService);
  redisService = app.get(RedisService);
});

afterEach(async () => {
  await redisService.flushAll();
});

describe('channel method', () => {
  it('save & get data is success', async () => {
    userRedisService.saveChannelData(
      { userId: 'abc', workspaceId: 'workspace-01', channelId: 'channel-01' },
      {
        lastCheckMessageId: 'a',
        latestMessageId: 'a',
      },
    );

    const result = await userRedisService.getChannelData({
      userId: 'abc',
      workspaceId: 'workspace-01',
      channelId: 'channel-01',
    });

    expect(result).toEqual({
      lastCheckMessageId: 'a',
      latestMessageId: 'a',
    });
  });
});
