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
import { socketIoClientFactory } from './__test__/socketIoClientFactory';

let app: INestApplication;
let socketIoInboundService: SocketIoInboudService;
let prisma: PrismaService;
let redisService: RedisService;
let channelService: ChannelService;
let userRedisService: UserRedisService;
let port: number;

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
  port = app.getHttpServer().listen().address().port;
});
afterEach(async () => {
  await redisService.redis.flushall();
  await prisma.clearDatabase();
});
afterAll(async () => {
  await app.close();
});

describe('saveMessage', () => {
  it('send correct data to client successfully, and typeof data={message, metadata}', (done) => {
    const asyncEvaluationFunction = async () => {
      const workspace = await createWorkspace();
      const channel = await createChannel({ workspaceId: workspace.id });
      const user = await createUser();
      const message = 'message';
      socketIoClientFactory(port).then((socket) => {
        socket
          .on('connect', async () => {
            await channelService.subscribeChannel(user.id, channel.id);
            await userRedisService.setSocketAt(user.id, socket.id);
            await socketIoInboundService.saveMessage(user, {
              message,
              socketInfo: { channelId: channel.id, workspaceId: workspace.id },
            });
          })
          .on('message.create', (data) => {
            expect(data).toEqual(
              expect.objectContaining({
                message: expect.any(Object),
                metadata: expect.any(Object),
              }),
            );
            socket.close();
            done();
          });
      });
      return;
    };

    asyncEvaluationFunction();
  });

  it('send correct data to client successfully in multiple message request', (done) => {
    const asyncEvaluationFunction = async () => {
      const sockets = [];
      const resultArray = [];
      const doneCallback = (data: any) => {
        resultArray.push(data);
        if (resultArray.length === 2) {
          expect(resultArray[1]).toEqual(
            expect.objectContaining({
              message: expect.any(Object),
              metadata: { unreadMessageCount: 2 },
            }),
          );
          sockets.forEach((socket) => {
            socket.close();
          });
          done();
        }
      };

      const workspace = await createWorkspace();
      const channel = await createChannel({ workspaceId: workspace.id });
      const user = await createUser();
      const messages = ['message-01', 'message-02'];

      socketIoClientFactory(port).then((socket) => {
        socket
          .on('connect', async () => {
            sockets.push(socket);
            await channelService.subscribeChannel(user.id, channel.id);
            await userRedisService.setSocketAt(user.id, socket.id);
            await Promise.all(
              messages.map(async (message) => {
                await socketIoInboundService.saveMessage(user, {
                  message,
                  socketInfo: {
                    channelId: channel.id,
                    workspaceId: workspace.id,
                  },
                });
              }),
            );
          })
          .on('message.create', (data) => {
            doneCallback(data);
          });
      });
      return;
    };

    asyncEvaluationFunction();
  });

  it('send correct data successfully if 1 user, 2 socket', (done) => {
    const asyncEvaluationFunction = async () => {
      const sockets = [];
      const resultArray = [];
      const doneCallback = (data: any) => {
        resultArray.push(data);
        if (resultArray.length >= 2) {
          sockets.forEach((socket) => socket.close());
          done();
        }
      };

      const workspace = await createWorkspace();
      const channel = await createChannel({ workspaceId: workspace.id });
      const user = await createUser();
      const message = 'message';

      await socketIoClientFactory(port).then((socket1) => {
        socket1
          .on('connect', async () => {
            sockets.push(socket1);
            await channelService.subscribeChannel(user.id, channel.id);
            await userRedisService.setSocketAt(user.id, socket1.id);

            socketIoClientFactory(port).then((socket2) => {
              socket2
                .on('connect', async () => {
                  sockets.push(socket2);
                  await channelService.subscribeChannel(user.id, channel.id);
                  await userRedisService.setSocketAt(user.id, socket2.id);
                  await socketIoInboundService.saveMessage(user, {
                    message,
                    socketInfo: {
                      channelId: channel.id,
                      workspaceId: workspace.id,
                    },
                  });
                })
                .on('message.create', (data) => doneCallback(data));
            });
          })
          .on('message.create', (data) => doneCallback(data));
      });
      return;
    };

    asyncEvaluationFunction();
  });

  it('send correct data successfully if 2users, 1socket', (done) => {
    const asyncEvaluationFunction = async () => {
      const sockets = [];
      const resultArray = [];
      const doneCallback = (data: any) => {
        resultArray.push(data);
        if (resultArray.length >= 2) {
          sockets.forEach((socket) => socket.close());
          done();
        }
      };

      const workspace = await createWorkspace();
      const channel = await createChannel({ workspaceId: workspace.id });
      const users = await Promise.all([createUser(), createUser()]);
      const message = 'message';

      users.forEach((user, index) => {
        socketIoClientFactory(port).then((socket) => {
          socket
            .on('connect', async () => {
              sockets.push(socket);
              await channelService.subscribeChannel(user.id, channel.id);
              await userRedisService.setSocketAt(user.id, socket.id);
              if (index === 1) {
                await socketIoInboundService.saveMessage(user, {
                  message,
                  socketInfo: {
                    channelId: channel.id,
                    workspaceId: workspace.id,
                  },
                });
              }
            })
            .on('message.create', (data) => doneCallback(data));
        });
      });
      return;
    };

    asyncEvaluationFunction();
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
