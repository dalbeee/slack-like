import { Test, TestingModule } from '@nestjs/testing';

import { createChannel } from '@src/channel/__test__/createChannel';
import { createMessage } from '@src/message/__test__/createMessage';
import { PrismaService } from '@src/prisma.service';
import { createWorkspace } from '@src/workspace/__test__/createWorkspace';
import { UserModule } from './user.module';
import { UserRedisService } from './user-redis.service';
import { createUser } from './__test__/createUser';
import { RedisService } from '@src/redis/redis.service';

let app: TestingModule;
let userRedisService: UserRedisService;
let redisService: RedisService;
let prisma: PrismaService;

beforeAll(async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [UserModule],
  }).compile();
  app = await moduleRef.init();
  userRedisService = app.get(UserRedisService);
  redisService = app.get(RedisService);
  prisma = app.get(PrismaService);
});

afterEach(async () => {
  await prisma.clearDatabase();
  await redisService.redis.flushall();
});
afterAll(async () => {
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

      expect(result).toEqual({ unreadMessageCount: 2 });
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

      expect(result).toEqual({ unreadMessageCount: 0 });
    });
  });

  describe('getChannelDataAll', () => {
    it('return value if success', async () => {
      const workspace = await createWorkspace();
      const channels = [
        await createChannel({ workspaceId: workspace.id }),
        await createChannel({ workspaceId: workspace.id }),
        await createChannel({ workspaceId: workspace.id }),
      ];
      const targetObject = { unreadMessageCount: 1 };
      const expectedObject = {
        [channels[0].id]: targetObject,
        [channels[1].id]: targetObject,
        [channels[2].id]: targetObject,
      };
      const user = await createUser();
      await Promise.all(
        channels.map((channel) =>
          userRedisService._setChannelDataAt(
            {
              userId: user.id,
              workspaceId: workspace.id,
              channelId: channel.id,
            },
            targetObject,
          ),
        ),
      );

      const result = await userRedisService.getChannelDataAll(
        user.id,
        workspace.id,
      );

      expect(result).toEqual(expectedObject);
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
  describe('setSocketAt', () => {
    it('return value if success', async () => {
      const user = await createUser();
      const socketIds = ['socket-01', 'socket-02'];
      await userRedisService.setSocketAt(user.id, socketIds[0]);

      const result = await userRedisService.setSocketAt(user.id, socketIds[1]);

      socketIds.forEach((socketId) => {
        expect(result).toContain(socketId);
      });
    });

    it('throw error if not found user', async () => {
      const notExistUserId = 'abc';

      const result = () =>
        userRedisService.setSocketAt(notExistUserId, 'socket-01');

      await expect(result).rejects.toThrowError();
    });
  });

  describe('findSocketByUserId', () => {
    it('return array of socketId if success', async () => {
      const user = await createUser();
      const socketId = 'socket-01';
      await userRedisService.setSocketAt(user.id, socketId);
      const result = await userRedisService.findSocketByUserId(user.id);

      expect(result).toContain(socketId);
    });

    it('return empty array if not found socket', async () => {
      const users = [await createUser(), await createUser()];
      const socketId = 'socket-01';
      await userRedisService.setSocketAt(users[0].id, socketId);

      const result = await userRedisService.findSocketByUserId(users[1].id);

      expect(result).toEqual([]);
    });
  });

  describe('findSocketByUserId', () => {
    it('return array of socketId if success', async () => {
      const users = [await createUser(), await createUser()];
      const userIds = users.map((user) => user.id);
      const socketIds = ['socket-01', 'socket-02'];

      await Promise.all(
        users.map((_, idx) =>
          userRedisService.setSocketAt(users[idx].id, socketIds[idx]),
        ),
      );

      const result = await userRedisService.findSocketByUserIds(userIds);

      socketIds.forEach((socketId) => {
        expect(result).toContain(socketId);
      });
    });
  });

  describe('findSocketByMessageAuthor', () => {
    it('return array of socketId if success', async () => {
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

      expect(result).toContain(id);
    });
  });

  describe('removeSocketAt', () => {
    it('return true if success', async () => {
      const user = await createUser();
      const socketIds = ['socket-01', 'socket-02'];
      await userRedisService.setSocketAt(user.id, socketIds[0]);

      const result = await userRedisService.removeSocketAt(
        user.id,
        socketIds[0],
      );
      expect(result).toBeTruthy();

      const result2 = await userRedisService.findSocketByUserId(user.id);
      expect(result2).toEqual([]);
    });

    it('return true if success in multiple length', async () => {
      const user = await createUser();
      const socketIds = ['socket-01', 'socket-02'];
      socketIds.forEach((socketId) => {
        userRedisService.setSocketAt(user.id, socketId);
      });

      const result = await userRedisService.removeSocketAt(
        user.id,
        socketIds[0],
      );
      expect(result).toBeTruthy();

      const result2 = await userRedisService.findSocketByUserId(user.id);
      expect(result2).toEqual(['socket-02']);
    });
  });
});
