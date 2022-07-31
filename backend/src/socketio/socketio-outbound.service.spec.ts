import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { SocketIoModule } from './socketio.module';
import { SocketIoOutboundService } from './socketio-outbound.service';
import { socketIoClientFactory } from './__test__/socketIoClientFactory';
import { SocketIoGateway } from './socketio.gateway';
import { Server } from 'socket.io';
import { createUser } from '@src/user/__test__/createUser';
import { UserRedisService } from '@src/user/user-redis.service';
import { createWorkspace } from '@src/workspace/__test__/createWorkspace';
import { createChannel } from '@src/channel/__test__/createChannel';
import { ChannelService } from '@src/channel/channel.service';
import { PrismaService } from '@src/prisma.service';
import { Socket } from 'socket.io-client';

let app: INestApplication;
let socketIoGateway: SocketIoGateway;
let socketIoOutboundService: SocketIoOutboundService;
let userRedisService: UserRedisService;
let channelService: ChannelService;
let prismaService: PrismaService;
let port: number;

beforeAll(async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [SocketIoModule],
  }).compile();
  app = moduleRef.createNestApplication();
  await app.init();
  socketIoGateway = app.get(SocketIoGateway);
  socketIoOutboundService = app.get(SocketIoOutboundService);
  userRedisService = app.get(UserRedisService);
  channelService = app.get(ChannelService);
  prismaService = app.get(PrismaService);
  port = app.getHttpServer().listen().address().port;
});
afterEach(async () => {
  await prismaService.clearDatabase();
  jest.restoreAllMocks();
});
afterAll(async () => {
  await app.close();
});

describe('sendToClient', () => {
  it('send success', (done) => {
    jest
      .spyOn(socketIoGateway, 'handleConnection')
      .mockImplementation(() => Promise.resolve(new Server()) as any);
    const asyncEvaluationFunction = async () => {
      const sockets: Socket[] = [];
      const resultArray = [];
      const messageKey = 'messagekey';
      const expectedData = { hello: 'world' };
      const user1 = await createUser();
      const user2 = await createUser();
      socketIoClientFactory(port).then((socket1) => {
        socket1
          .on('connect', async () => {
            sockets.push(socket1);
            await userRedisService.setSocketAt(user1.id, socket1.id);
            socketIoClientFactory(port).then((socket2) => {
              socket2
                .on('connect', async () => {
                  sockets.push(socket2);
                  await userRedisService.setSocketAt(user2.id, socket2.id);

                  await socketIoOutboundService.sendToClient(
                    { messageKey, socketId: socket1.id },
                    expectedData,
                  );
                })
                .on(messageKey, (data) => {
                  doneCallback(data);
                });
            });
          })
          .on(messageKey, (data) => {
            doneCallback(data);
          });
      });

      const doneCallback = (data: unknown) => {
        resultArray.push(data);
        if (resultArray.length === 1) {
          expect(resultArray[0]).toEqual(expectedData);
          sockets.forEach((socket) => socket.close());
          done();
        }
      };
    };

    asyncEvaluationFunction();
  });
});

describe('sendToUser', () => {
  it('send success', (done) => {
    jest
      .spyOn(socketIoGateway, 'handleConnection')
      .mockImplementation(() => Promise.resolve(new Server()) as any);

    const asyncEvaluationFunction = async () => {
      const sockets: Socket[] = [];
      const resultArray = [];
      const messageKey = 'messagekey';
      const expectedData = { hello: 'world' };
      const user = await createUser();
      socketIoClientFactory(port).then((socket1) => {
        socket1
          .on('connect', async () => {
            sockets.push(socket1);
            await userRedisService.setSocketAt(user.id, socket1.id);
            socketIoClientFactory(port).then((socket2) => {
              socket2
                .on('connect', async () => {
                  sockets.push(socket2);
                  await userRedisService.setSocketAt(user.id, socket2.id);

                  await socketIoOutboundService.sendToUser(
                    { messageKey, userId: user.id },
                    expectedData,
                  );
                })
                .on(messageKey, (data) => {
                  doneCallback(data);
                });
            });
          })
          .on(messageKey, (data) => {
            doneCallback(data);
          });
      });

      const doneCallback = (data: unknown) => {
        resultArray.push(data);
        if (resultArray.length === 2) {
          expect(resultArray[0]).toEqual(expectedData);
          sockets.forEach((socket) => socket.close());
          done();
        }
      };
    };

    asyncEvaluationFunction();
  });
});

describe('sendToChannel', () => {
  it('send success', (done) => {
    jest
      .spyOn(socketIoGateway, 'handleConnection')
      .mockImplementation(() => Promise.resolve(new Server()) as any);

    const asyncEvaluationFunction = async () => {
      const sockets: Socket[] = [];
      const resultArray = [];
      const messageKey = 'messagekey';
      const expectedData = { hello: 'world' };
      const workspace = await createWorkspace();
      const channel = await createChannel({ workspaceId: workspace.id });
      const user1 = await createUser();
      const user2 = await createUser();
      await channelService.subscribeChannel(user1.id, channel.id);
      await channelService.subscribeChannel(user2.id, channel.id);
      socketIoClientFactory(port).then((socket1) => {
        socket1
          .on('connect', async () => {
            sockets.push(socket1);
            await userRedisService.setSocketAt(user1.id, socket1.id);
            socketIoClientFactory(port).then((socket2) => {
              socket2
                .on('connect', async () => {
                  sockets.push(socket2);
                  await userRedisService.setSocketAt(user2.id, socket2.id);

                  await socketIoOutboundService.sendToChannel(
                    { messageKey, channelId: channel.id },
                    expectedData,
                  );
                })
                .on(messageKey, (data) => {
                  doneCallback(data);
                });
            });
          })
          .on(messageKey, (data) => {
            doneCallback(data);
          });
      });

      const doneCallback = (data: unknown) => {
        resultArray.push(data);
        if (resultArray.length === 2) {
          expect(resultArray[0]).toEqual(expectedData);
          sockets.forEach((socket) => socket.close());
          done();
        }
      };
    };

    asyncEvaluationFunction();
  });

  it('send only channel subscribed users', (done) => {
    jest
      .spyOn(socketIoGateway, 'handleConnection')
      .mockImplementation(() => Promise.resolve(new Server()) as any);

    const asyncEvaluationFunction = async () => {
      const sockets: Socket[] = [];
      const resultArray = [];
      const messageKey = 'messagekey';
      const expectedData = { hello: 'world' };
      const workspace = await createWorkspace();
      const channel = await createChannel({ workspaceId: workspace.id });
      const user1 = await createUser();
      const user2 = await createUser();
      await channelService.subscribeChannel(user1.id, channel.id);
      socketIoClientFactory(port).then((socket1) => {
        socket1
          .on('connect', async () => {
            sockets.push(socket1);
            await userRedisService.setSocketAt(user1.id, socket1.id);
            socketIoClientFactory(port).then((socket2) => {
              socket2
                .on('connect', async () => {
                  sockets.push(socket2);
                  await userRedisService.setSocketAt(user2.id, socket2.id);

                  await socketIoOutboundService.sendToChannel(
                    { messageKey, channelId: channel.id },
                    expectedData,
                  );
                })
                .on(messageKey, (data) => {
                  doneCallback(data);
                });
            });
          })
          .on(messageKey, (data) => {
            doneCallback(data);
          });
      });

      const doneCallback = (data: unknown) => {
        resultArray.push(data);
        if (resultArray.length === 1) {
          expect(resultArray[0]).toEqual(expectedData);
          sockets.forEach((socket) => socket.close());
          done();
        }
      };
    };

    asyncEvaluationFunction();
  });
});
