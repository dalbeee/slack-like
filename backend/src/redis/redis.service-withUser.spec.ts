import { Test, TestingModule } from '@nestjs/testing';

import { RedisModule } from './redis.module';
import { RedisService } from './redis.service';

let app: TestingModule;
let redisService: RedisService;

beforeAll(async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [RedisModule],
  }).compile();
  app = await moduleRef.init();
  redisService = app.get(RedisService);
});

afterEach(async () => {
  await redisService.redis.flushall();
});
afterAll(async () => {
  await app.close();
});

describe('test redisService with data', () => {
  const user = {
    id: 'a',
    name: 'a',
    workspaces: {
      'workspace-01': {
        'channel-01': {
          latestMessageId: 'a-1',
          lastCheckMessageId: 'a-2',
        },
        'channel-02': {
          latestMessageId: 'b-2',
          lastCheckMessageId: 'a-2',
        },
      },
    },
    sockets: {
      'workspace-01': 'string1',
      'workspace-02': 'string2',
    },
  };

  describe('hGet', () => {
    it('return value if request specific field', async () => {
      redisService.hmSet(`user:${user.id}`, user);

      const workspaces = await redisService.hGet(
        `user:${user.id}`,
        'workspaces',
      );

      expect(workspaces['workspace-01']).toEqual({
        'channel-01': {
          latestMessageId: 'a-1',
          lastCheckMessageId: 'a-2',
        },
        'channel-02': {
          latestMessageId: 'b-2',
          lastCheckMessageId: 'a-2',
        },
      });
    });

    it('return value if request nested field', async () => {
      redisService.hmSet(`user:${user.id}`, user);

      const data = await redisService.hGet(
        `user:${user.id}`,
        'workspaces',
        'workspace-01',
        'channel-01',
      );

      expect(data).toEqual(
        expect.objectContaining({
          latestMessageId: 'a-1',
          lastCheckMessageId: 'a-2',
        }),
      );
    });

    it('return value if request specific field', async () => {
      redisService.hmSet(`user:${user.id}`, user);

      const data = await redisService.hGet(
        `user:${user.id}`,
        'sockets',
        'workspace-01',
      );

      expect(data).toEqual('string1');
    });
  });
});
