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
afterAll(async () => {
  await app.close();
});

describe('ioredis default behavior', () => {
  it('hset', async () => {
    const result = await redisService.redis.hset('test', 'test', 'test');

    expect(result).toEqual(expect.any(Number));
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

  it('hGetAll', async () => {
    redisService.hSet('a', 'a', { a: 1 });
    redisService.hSet('a', 'b', { b: 1 });
    redisService.hSet('a', 'c', 1);

    const result = await redisService.hGetAll<any>('a');

    expect(result.a).toEqual({ a: 1 });
    expect(result.b).toEqual({ b: 1 });
    expect(result.c).toEqual(1);
  });

  it('hmSet', async () => {
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

  it('hAppend update specific field and return', async () => {
    await redisService.hSet('test', 'test', { test: 'a', target: 'a' });
    const result = await redisService.hAppend('test', 'test', {
      test: 'a',
      target: 'b',
    });

    expect(result).toEqual({ test: 'a', target: 'b' });
  });
});
