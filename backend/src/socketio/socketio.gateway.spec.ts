import { Test } from '@nestjs/testing';
import { io, Socket, SocketOptions, ManagerOptions } from 'socket.io-client';
import { INestApplication } from '@nestjs/common';

import { SocketIoGateway } from './socketio.gateway';
import { SocketIoModule } from './socketio.module';
import { createUser } from '@src/user/__test__/createUser';
import { createWorkspace } from '@src/workspace/__test__/createWorkspace';
import { createChannel } from '@src/channel/__test__/createChannel';
import { createAccessToken } from '@src/auth/__test__/createAccessToken';

let app: INestApplication;
let socketGateway: SocketIoGateway;
let socketFactory: (
  options?: Partial<ManagerOptions | SocketOptions>,
) => Socket;

beforeEach(async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [SocketIoModule],
  }).compile();
  app = moduleRef.createNestApplication();
  await app.init();
  socketGateway = app.get(SocketIoGateway);

  socketFactory = (options?: SocketOptions) => {
    const getPort = () => app.getHttpServer().listen().address().port;
    return io(`http://localhost:${getPort()}`, options || {});
  };
});

afterEach(async () => {
  await app.close();
});

describe('inbound methods', () => {
  describe('_saveSocketId', () => {
    it('return socket if success', async () => {
      const user = await createUser();
      const dto = {
        userId: user.id,
        socketId: 'a',
      };
      const result = await socketGateway._saveSocketId(dto);

      expect(result).toEqual(1);
    });

    it('throw error if invalid userId', async () => {
      const dto = {
        userId: 'a',
        socketId: 'a',
      };
      const result = () => socketGateway._saveSocketId(dto);

      await expect(result).rejects.toThrowError();
    });
  });

  describe('_findSocketIdFromUserId', () => {
    it('return socket value if success', async () => {
      const socketId = 'socketId';
      const user = await createUser();
      const dto = {
        userId: user.id,
        socketId,
      };
      await socketGateway._saveSocketId(dto);

      const result = await socketGateway._findSocketIdFromUserId(user.id);

      expect(result).toEqual(socketId);
    });

    it('return null if not found data', async () => {
      const socketId = 'socketId';
      const users = [await createUser(), await createUser()];
      const dto = {
        userId: users[0].id,
        socketId,
      };
      await socketGateway._saveSocketId(dto);

      const result = await socketGateway._findSocketIdFromUserId(users[1].id);

      expect(result).toBeNull();
    });
  });
});

describe('outbound methods', () => {
  describe('broadcastToClients', () => {
    it('send message successfully', (done) => {
      const expectedValue = 'expectedValue';
      const messageKey = 'test';
      socketFactory()
        .on('connect', () => {
          socketGateway.broadcastToClients(messageKey, expectedValue);
        })
        .on(messageKey, (data) => {
          expect(data).toEqual(expectedValue);
          done();
        });
    });
  });

  describe('sendToClientBySocketId', () => {
    it('send message successfully', (done) => {
      const expectedValue = 'expectedValue';
      const messageKey = 'test';
      const socket = socketFactory()
        .on('connect', () => {
          socketGateway.sendToClientBySocketId(
            {
              socketId: socket.id,
              messageKey,
            },
            expectedValue,
          );
        })
        .on(messageKey, (data) => {
          expect(data).toEqual(expectedValue);
          done();
        });
    });
  });
});

describe('integral test', () => {
  describe('sendToClientByUserId', () => {
    const getData = async () => {
      const workspace = await createWorkspace();
      const channel = await createChannel({ workspaceId: workspace.id });
      const user = await createUser();
      const access_token = await createAccessToken(user);
      return { user, workspace, channel, access_token };
    };

    it('send message successfully', (done) => {
      const expectedValue = 'expectedValue';
      const messageKey = 'test';
      getData().then((r) => {
        const socket = socketFactory({
          auth: { Authorization: `Bearer ${r.access_token}` },
        })
          .on('connect', () => {
            socket.emit('connection', {
              workspaceId: r.workspace.id,
              channelId: r.channel.id,
            });

            // socketGateway.sendToClientBySocketId(
            //   {
            //     socketId: socket.id,
            //     messageKey,
            //   },
            //   expectedValue,
            // );
          })
          .on(messageKey, (data) => {
            expect(data).toEqual(expectedValue);
            done();
          });
      });
    });
  });
});
