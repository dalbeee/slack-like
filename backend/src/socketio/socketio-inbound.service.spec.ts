import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { ChannelService } from '@src/channel/channel.service';
import { createChannel } from '@src/channel/__test__/createChannel';
import { PrismaService } from '@src/prisma.service';
import { RedisService } from '@src/redis/redis.service';
import { UserRedisService } from '@src/user/user-redis.service';
import { createUser } from '@src/user/__test__/createUser';
import { createWorkspace } from '@src/workspace/__test__/createWorkspace';
import { ChannelSpecificDto } from './dto/channel-specific.dto';
import { SocketIoInboudService } from './socketio-inbound.service';
import { SocketIoModule } from './socketio.module';

let app: INestApplication;
let socketIoInboundService: SocketIoInboudService;
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
  socketIoInboundService = app.get(SocketIoInboudService);
  prisma = app.get(PrismaService);
  redisService = app.get(RedisService);
  channelService = app.get(ChannelService);
  userRedisService = app.get(UserRedisService);
});
afterEach(async () => {
  await redisService.redis.flushall();
  await prisma.clearDatabase();
});
afterAll(async () => {
  await app.close();
});

describe('saveMessage', () => {
  it('send correct data to client successfully, and typeof data={message, metadata}', async () => {
    const workspace = await createWorkspace();
    const channel = await createChannel({ workspaceId: workspace.id });
    const user = await createUser();
    const message = 'message';
    const socketId = 'socketId';
    await channelService.subscribeChannel(user.id, channel.id);
    await userRedisService.setSocketAt(user.id, socketId);
    const result = await socketIoInboundService.saveMessage(user, {
      message,
      socketInfo: { channelId: channel.id, workspaceId: workspace.id },
    });

    expect(result).toEqual(true);
  });
});

describe('updateChannelMetadata', () => {
  it('return value if success', async () => {
    const dto: ChannelSpecificDto = {
      channelId: 'channelId',
      workspaceId: 'workspaceId',
      userId: 'userId',
    };

    const result = await socketIoInboundService.increaseUnreadMessageCount(dto);

    expect(result).toEqual({ unreadMessageCount: 1 });
  });
});

describe('setZeroUnreadMessageCount', () => {
  it('return value if success', async () => {
    const dto: ChannelSpecificDto = {
      channelId: 'channelId',
      workspaceId: 'workspaceId',
      userId: 'userId',
    };

    const result = await socketIoInboundService.setZeroUnreadMessageCount(dto);

    expect(result).toEqual({ unreadMessageCount: 0 });
  });
});
