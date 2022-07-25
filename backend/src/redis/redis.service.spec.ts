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
  redisService = app.get<RedisService>(RedisService);
});
afterEach(async () => {
  await redisService.redis.flushall();
});
afterAll(async () => {
  await app.close();
});

describe('ioredis default behavior', () => {
  describe('hset', () => {
    it('hset', async () => {
      const result = await redisService.redis.hset('test', 'test', 'test');

      expect(result).toEqual(expect.any(Number));
    });
  });

  describe('sadd, smember', () => {
    it('sadd has no ordering information', async () => {
      const key = 'key';
      const values = ['test', 'test2', 'test3', 'test4'];
      redisService.redis.sadd(key, values);

      const result = await redisService.redis.smembers(key);

      values.forEach((value) => {
        expect(result).toContain(value);
      });
    });
  });
});

describe('redisService behavior', () => {
  describe('hGet', () => {
    it('return value', async () => {
      redisService.hSet('a', 'b', { a: 1 });

      const result = await redisService.hGet('a', 'b');

      expect(result).toEqual(
        expect.objectContaining({ a: expect.any(Number) }),
      );
    });

    it('return value if nested path point stored value ', async () => {
      const data = {
        a: 1,
        b: { a: 1, b: 2 },
      };
      redisService.hSet('a', 'b', data);

      const result = await redisService.hGet('a', 'b', 'a');

      expect(result).toEqual(1);
    });

    it('return object if nested path point stored object ', async () => {
      const data = {
        a: 1,
        b: { a: 1, b: 2 },
      };
      redisService.hSet('a', 'b', data);

      const result = await redisService.hGet('a', 'b', 'b');

      expect(result).toEqual({ a: 1, b: 2 });
    });
  });

  describe('hGetAll', () => {
    it('return value if success', async () => {
      redisService.hSet('a', 'a', { a: 1 });
      redisService.hSet('a', 'b', { b: 1 });
      redisService.hSet('a', 'c', 1);

      const result = await redisService.hGetAll<any>('a');

      expect(result.a).toEqual({ a: 1 });
      expect(result.b).toEqual({ b: 1 });
      expect(result.c).toEqual(1);
    });
  });

  describe('hmSet', () => {
    it('return value if success', async () => {
      const user = {
        id: 'a',
        name: 'a',
        channels: {
          'channel-01': {
            latestMessageId: 'b',
            lastCheckMessageId: 'a',
          },
        },
      };
      type User = typeof user;
      redisService.hmSet('user:a', user);

      const result = await redisService.hGetAll<User>('user:a');

      expect(result.id).toEqual('a');
      expect(result.name).toEqual('a');
      expect(result.channels['channel-01']).toEqual(
        expect.objectContaining({
          latestMessageId: 'b',
          lastCheckMessageId: 'a',
        }),
      );
    });
  });

  describe('hAppend', () => {
    it('update specific field and return', async () => {
      await redisService.hSet('test', 'test', { test: 'a', target: 'a' });
      const result = await redisService.hAppend('test', 'test', {
        test: 'a',
        target: 'b',
      });

      expect(result).toEqual({ test: 'a', target: 'b' });
    });
  });

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

  describe('save', () => {
    it('return value if success', async () => {
      const result = await redisService.save('user', user);

      expect(result).toEqual(user);
    });
  });

  describe('get', () => {
    it('return value if success', async () => {
      redisService.save('user', user);
      const result = await redisService.get('user');

      expect(result).toEqual(user);
    });
  });
});
