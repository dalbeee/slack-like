import { Test, TestingModule } from '@nestjs/testing';
import { ChannelModule } from '@src/channel/channel.module';
import { RedisModule } from '@src/redis/redis.module';
import { RedisService } from '@src/redis/redis.service';
import { WorkspaceModule } from '@src/workspace/workspace.module';
import { UserRedisService } from './user.redis-service';

let app: TestingModule;
let userRedisService: UserRedisService;
let redisService: RedisService;

beforeAll(async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [RedisModule, WorkspaceModule, ChannelModule],
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
    userRedisService.saveChannelDataAt(
      { userId: 'abc', workspaceId: 'workspace-01', channelId: 'channel-01' },
      {
        lastCheckMessageId: 'a',
        latestMessageId: 'a',
      },
    );

    const result = await userRedisService.getChannelDataBy({
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

// describe('getChennelDataAll', () => {
//   it('', async () => {
//     await userRedisService.saveChannelDataAt(
//       {
//         userId: '29460163-e107-4e46-b9f5-ff5a0c203774',
//         workspaceId: '57e40cd8-efb0-4c48-835d-5454ba810b15',
//         channelId: '16b302c6-36d5-4f99-8213-63c887896f8d',
//       },
//       {
//         lastCheckMessageId: 'a',
//         latestMessageId: 'a',
//       },
//     );

//     const result = await userRedisService.getChannelDataAll(
//       '57e40cd8-efb0-4c48-835d-5454ba810b15',
//     );

//     expect(result).toBeDefined();
//   });
// });
