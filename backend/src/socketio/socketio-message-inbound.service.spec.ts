import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { ChannelService } from '@src/channel/channel.service';
import { createChannel } from '@src/channel/__test__/createChannel';
import { PrismaService } from '@src/prisma.service';
import { RedisService } from '@src/redis/redis.service';
import { UserRedisService } from '@src/user/user-redis.service';
import { createUser } from '@src/user/__test__/createUser';
import { createWorkspace } from '@src/workspace/__test__/createWorkspace';
import { SocketIoMessageInboundService } from './socketio-message-inbound.service';
import { SocketIoModule } from './socketio.module';

let app: INestApplication;
let socketIoMessageInboundService: SocketIoMessageInboundService;
let prisma: PrismaService;
let redisService: RedisService;
let channelService: ChannelService;
let userRedisService: UserRedisService;

beforeAll(async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [SocketIoModule],
  }).compile();
  app = moduleRef.createNestApplication();
  await app.init();
  prisma = app.get(PrismaService);
  redisService = app.get(RedisService);
  channelService = app.get(ChannelService);
  userRedisService = app.get(UserRedisService);
  socketIoMessageInboundService = app.get(SocketIoMessageInboundService);
});
afterEach(async () => {
  await redisService.redis.flushall();
  await prisma.clearDatabase();
});
afterAll(async () => {
  await app.close();
});

describe('createItem', () => {
  it('send correct data to client successfully, and typeof data={message, metadata}', async () => {
    const workspace = await createWorkspace();
    const channel = await createChannel({ workspaceId: workspace.id });
    const user = await createUser();
    const content = 'content';
    const socketId = 'socketId';
    await channelService.subscribeChannel(user.id, channel.id);
    await userRedisService.setSocketAt(user.id, socketId);
    const result = await socketIoMessageInboundService.createItem(user, {
      workspaceId: workspace.id,
      channelId: channel.id,
      content,
      socketInfo: { channelId: channel.id, workspaceId: workspace.id },
    });

    expect(result).toEqual(
      expect.objectContaining({
        workspaceId: expect.any(String),
        channelId: expect.any(String),
        userId: expect.any(String),
        content: expect.any(String),
      }),
    );
  });
});
