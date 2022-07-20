import { Test, TestingModule } from '@nestjs/testing';

import { ChannelModule } from '@src/channel/channel.module';
import { createChannel } from '@src/channel/__test__/createChannel';
import { MessageModule } from '@src/message/message.module';
import { createMessage } from '@src/message/__test__/createMessage';
import { PrismaService } from '@src/prisma.service';
import { RedisModule } from '@src/redis/redis.module';
import { RedisService } from '@src/redis/redis.service';
import { WorkspaceModule } from '@src/workspace/workspace.module';
import { createWorkspace } from '@src/workspace/__test__/createWorkspace';
import { UserRedisService } from './user.redis-service';
import { UserService } from './user.service';
import { createUser } from './__test__/createUser';

let app: TestingModule;
let userRedisService: UserRedisService;
let redisService: RedisService;
let prisma: PrismaService;

beforeAll(async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [RedisModule, WorkspaceModule, ChannelModule, MessageModule],
    providers: [UserRedisService, UserService, PrismaService],
  }).compile();
  app = await moduleRef.init();
  userRedisService = app.get(UserRedisService);
  redisService = app.get(RedisService);
  prisma = app.get(PrismaService);
});

afterEach(async () => {
  await redisService.redis.flushall();
  await prisma.clearDatabase();
});
afterAll(async () => {
  await prisma.$disconnect();
  await app.close();
});

describe('channel methods', () => {
  describe('_setChannelDataAt', () => {
    it('return any value', async () => {
      const result = await userRedisService._setChannelDataAt(
        {
          userId: 'abc',
          workspaceId: 'workspace-01',
          channelId: 'channel-01',
        },
        { unreadMessageCount: 1 },
      );

      expect(result).toBeDefined();
    });
  });

  describe('increaseUnreadMessageCount', () => {
    it('return value if success', async () => {
      const dto = {
        userId: 'abc',
        workspaceId: 'workspace-01',
        channelId: 'channel-01',
      };
      await userRedisService._setChannelDataAt(dto, {
        unreadMessageCount: 1,
      });
      const result = await userRedisService.increaseUnreadMessageCount(dto);

      expect(result).toBe(2);
    });
  });

  describe('setZeroUnreadMessageCount', () => {
    it('return value if success', async () => {
      const dto = {
        userId: 'abc',
        workspaceId: 'workspace-01',
        channelId: 'channel-01',
      };
      await userRedisService._setChannelDataAt(dto, {
        unreadMessageCount: 1,
      });
      const result = await userRedisService.setZeroUnreadMessageCount(dto);

      expect(result).toBe(0);
    });
  });

  describe('getChannelDataAll', () => {
    it('return value if success', async () => {
      const workspace = await createWorkspace();
      const channel = await createChannel({ workspaceId: workspace.id });
      const user = await createUser();
      await userRedisService._setChannelDataAt(
        {
          userId: user.id,
          workspaceId: workspace.id,
          channelId: channel.id,
        },
        { unreadMessageCount: 1 },
      );

      const result = await userRedisService.getChannelDataAll(
        user.id,
        workspace.id,
      );

      expect(result).toEqual({ [channel.id]: { unreadMessageCount: 1 } });
    });
  });

  describe('integral test ', () => {
    it('_setChannelDataAt & getChannelDataBy is success', async () => {
      userRedisService._setChannelDataAt(
        { userId: 'abc', workspaceId: 'workspace-01', channelId: 'channel-01' },
        { unreadMessageCount: 1 },
      );

      const result = await userRedisService.getChannelDataBy({
        userId: 'abc',
        workspaceId: 'workspace-01',
        channelId: 'channel-01',
      });

      expect(result).toEqual({ unreadMessageCount: 1 });
    });
  });
});

describe('socket methods', () => {
  describe('_findSocketByUserId', () => {
    it('return value if success', async () => {
      const user = await createUser();
      const socketId = 'socket-01';
      await userRedisService.setSocketAt(user.id, socketId);
      const result = await userRedisService._findSocketByUserId(user.id);

      expect(result).toEqual(socketId);
    });
  });

  describe('setSocketAt', () => {
    it('return value if success', async () => {
      const user = await createUser();

      const result = await userRedisService.setSocketAt(user.id, 'socket-01');

      expect(result).toEqual(expect.any(Number));
    });
    it('throw error if not found user', async () => {
      const notExistUserId = 'abc';

      const result = () =>
        userRedisService.setSocketAt(notExistUserId, 'socket-01');

      await expect(result).rejects.toThrowError();
    });
  });

  describe('findSocketByMessageAuthor', () => {
    it('return socketId if success', async () => {
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

      const result = await userRedisService.findSocketByMessageAuthor(
        message.id,
      );

      expect(result).toEqual(id);
    });
  });
});
