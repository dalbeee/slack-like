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
import { socketIoClientFactory } from './__test__/socketIoClientFactory';

let app: INestApplication;
let socketIoChannelInboundService: SocketIoChannelInboundService;
let channelService: ChannelService;
let prismaService: PrismaService;
let userRedisService: UserRedisService;
let redis: RedisService;
let port: number;

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
  port = app.getHttpServer().listen().address().port;
});
afterEach(async () => {
  await redis.redis.flushdb();
  await prismaService.clearDatabase();
});
afterAll(async () => {
  await app.close();
});

describe('createChannel', () => {
  it('send successfully', (done) => {
    const asyncEvaluationFunction = async () => {
      const user = await createUser();
      const workspace = await createWorkspace();
      const channel = await createChannel({ workspaceId: workspace.id });
      await channelService.subscribeChannel(user.id, channel.id);
      socketIoClientFactory(port).then((socket) => {
        socket
          .on('connect', async () => {
            await userRedisService.setSocketAt(user.id, socket.id);

            await socketIoChannelInboundService.createChannel(user, {
              name: 'channel',
              workspaceId: workspace.id,
            });
          })
          .on('channel.create', doneCallback);
      });

      const doneCallback = (data: any) => {
        expect(data).toEqual(
          expect.objectContaining({
            id: expect.any(String),
            name: expect.any(String),
            workspaceId: expect.any(String),
          }),
        );
        done();
      };
    };
    asyncEvaluationFunction();
  });
});

describe('subscribeChannel', () => {
  it('send successfully', (done) => {
    const asyncEvaluationFunction = async () => {
      const user = await createUser();
      const workspace = await createWorkspace();
      const channel = await createChannel({ workspaceId: workspace.id });
      await channelService.subscribeChannel(user.id, channel.id);
      socketIoClientFactory(port).then((socket) => {
        socket
          .on('connect', async () => {
            await userRedisService.setSocketAt(user.id, socket.id);

            await socketIoChannelInboundService.subscribeChannel(
              user.id,
              channel.id,
            );
          })
          .on('channel.subscribe', doneCallback);
      });

      const doneCallback = (data: any) => {
        expect(data).toEqual(true);
        done();
      };
    };
    asyncEvaluationFunction();
  });
});

describe('unsubscribeChannel', () => {
  it('send successfully', (done) => {
    const asyncEvaluationFunction = async () => {
      const user = await createUser();
      const workspace = await createWorkspace();
      const channel = await createChannel({ workspaceId: workspace.id });
      await channelService.subscribeChannel(user.id, channel.id);
      socketIoClientFactory(port).then((socket) => {
        socket
          .on('connect', async () => {
            await userRedisService.setSocketAt(user.id, socket.id);

            await socketIoChannelInboundService.unsubscribeChannel(
              user.id,
              channel.id,
            );
          })
          .on('channel.unsubscribe', doneCallback);
      });

      const doneCallback = (data: any) => {
        expect(data).toEqual(true);
        done();
      };
    };
    asyncEvaluationFunction();
  });
});
