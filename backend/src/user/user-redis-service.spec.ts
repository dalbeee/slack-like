import { Test, TestingModule } from '@nestjs/testing';

import { ChannelModule } from '@src/channel/channel.module';
import { createChannel } from '@src/channel/__test__/createChannel';
import { MessageModule } from '@src/message/message.module';
import { createMessage } from '@src/message/__test__/createMessage';
import { RedisModule } from '@src/redis/redis.module';
import { RedisService } from '@src/redis/redis.service';
import { WorkspaceModule } from '@src/workspace/workspace.module';
import { createWorkspace } from '@src/workspace/__test__/createWorkspace';
import { UserRedisService } from './user.redis-service';
import { createUser } from './__test__/createUser';

let app: TestingModule;
let userRedisService: UserRedisService;
let redisService: RedisService;

beforeAll(async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [RedisModule, WorkspaceModule, ChannelModule, MessageModule],
    providers: [UserRedisService],
  }).compile();
  app = await moduleRef.init();
  userRedisService = app.get(UserRedisService);
  redisService = app.get(RedisService);
});

afterEach(async () => {
  await redisService.flushAll();
});

describe('channel methods', () => {
  it('save & get data is success', async () => {
    userRedisService.setChannelDataAt(
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

  describe('getChennelDataAll', () => {
    it('', async () => {
      const workspace = await createWorkspace();
      const channel = await createChannel({ workspaceId: workspace.id });
      const user = await createUser();
      await userRedisService.setChannelDataAt(
        {
          userId: user.id,
          workspaceId: workspace.id,
          channelId: channel.id,
        },
        { lastCheckMessageId: 'a', latestMessageId: 'a' },
      );

      const result = await userRedisService.getChannelDataAll(
        user.id,
        workspace.id,
      );

      expect(result).toBeDefined();
    });
  });
});

describe('socket methods', () => {
  it('setSocketAt', async () => {
    const result = await userRedisService.setSocketAt('abc', 'socket-01');

    expect(result).toEqual(expect.any(Number));
  });
  it('return socket Id if success', async () => {
    const id = 'id';
    const user = await createUser();
    userRedisService.setSocketAt(user.id, id);

    const result = await userRedisService._findSocketByUserId(user.id);

    expect(result).toEqual(id);
  });

  it('return socket id if success', async () => {
    const id = 'id';
    const user = await createUser();
    const workspace = await createWorkspace();
    const channel = await createChannel({ workspaceId: workspace.id });
    const message = await createMessage({
      workspaceId: workspace.id,
      channelId: channel.id,
      content: 'content',
      userId: user.id,
    });
    userRedisService.setSocketAt(user.id, id);

    const result = await userRedisService.findSocketByMessageAuthor(message.id);

    expect(result).toEqual(id);
  });
});
