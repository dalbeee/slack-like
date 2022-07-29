import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { ChannelService } from '@src/channel/channel.service';
import { createChannel } from '@src/channel/__test__/createChannel';
import { PrismaService } from '@src/prisma.service';
import { RedisService } from '@src/redis/redis.service';
import { UserRedisService } from '@src/user/user-redis.service';
import { createUser } from '@src/user/__test__/createUser';
import { createWorkspace } from '@src/workspace/__test__/createWorkspace';
import { SocketIoChannelInboundService } from './socketio-channel-inbound.service';
import { SocketIoModule } from './socketio.module';
 

let app: INestApplication;
let socketIoChannelInboundService: SocketIoChannelInboundService;
let channelService: ChannelService;
let prismaService: PrismaService;
let userRedisService: UserRedisService;
let redis: RedisService;
 
beforeAll(async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [SocketIoModule],
  }).compile();
  app = moduleRef.createNestApplication();
  await app.init();
  socketIoChannelInboundService = app.get(SocketIoChannelInboundService);
  channelService = app.get(ChannelService);
  prismaService = app.get(PrismaService);
  redis = app.get(RedisService);
  userRedisService = app.get(UserRedisService);
 
});
afterEach(async () => {
  await redis.redis.flushdb();
  await prismaService.clearDatabase();
});
afterAll(async () => {
  await app.close();
});

describe('createChannel', () => {
  it('send successfully', async () => {
    const socketId = 'socketId';
    const user = await createUser();
    const workspace = await createWorkspace();
    const channel = await createChannel({ workspaceId: workspace.id });
    await channelService.subscribeChannel(user.id, channel.id);
    await userRedisService.setSocketAt(user.id, socketId);

    const result = await socketIoChannelInboundService.createChannel(user.id, {
      name: 'channel',
      workspaceId: workspace.id,
    });

    expect(result).toEqual(true);
  });
});

describe('subscribeChannel', () => {
  it('send successfully', async () => {
    const socketId = 'socketId';
    const user = await createUser();
    const workspace = await createWorkspace();
    const channel = await createChannel({ workspaceId: workspace.id });
    await channelService.subscribeChannel(user.id, channel.id);
    await userRedisService.setSocketAt(user.id, socketId);

    const result = await socketIoChannelInboundService.subscribeChannel(
      user.id,
      channel.id,
    );

    expect(result).toEqual(true);
  });
});

describe('unsubscribeChannel', () => {
  it('send successfully', async () => {
    const socketId = 'socketId';
    const user = await createUser();
    const workspace = await createWorkspace();
    const channel = await createChannel({ workspaceId: workspace.id });
    await channelService.subscribeChannel(user.id, channel.id);
    await userRedisService.setSocketAt(user.id, socketId);

    const result = await socketIoChannelInboundService.unsubscribeChannel(
      user.id,
      channel.id,
    );

    expect(result).toEqual(true);
  });
});
