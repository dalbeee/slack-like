import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { Server } from 'socket.io';

import { SocketIoGateway } from './socketio.gateway';
import { SocketIoModule } from './socketio.module';
import { createUser } from '@src/user/__test__/createUser';
import { socketIoClientFactory } from './__test__/socketIoClientFactory';

let app: INestApplication;
let socketGateway: SocketIoGateway;
let port: number;

beforeAll(async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [SocketIoModule],
  }).compile();
  app = moduleRef.createNestApplication();
  await app.init();
  socketGateway = app.get(SocketIoGateway);
  port = app.getHttpServer().listen().address().port;
});
afterAll(async () => {
  await app.close();
});

describe('connection methods', () => {
  describe('_saveSocketId', () => {
    it('return array of socket if success', async () => {
      const user = await createUser();
      const socketId = 'socketId';
      const dto = {
        userId: user.id,
        socketId,
      };
      const result = await socketGateway._saveSocketId(dto);

      expect(result).toContain(socketId);
    });

    it('throw error if invalid userId', async () => {
      const socketId = 'socketId';
      const dto = {
        userId: 'a',
        socketId,
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

      expect(result).toContain(socketId);
    });

    it('return empty array if no stored socket', async () => {
      const socketId = 'socketId';
      const users = [await createUser(), await createUser()];
      const dto = {
        userId: users[0].id,
        socketId,
      };
      await socketGateway._saveSocketId(dto);

      const result = await socketGateway._findSocketIdFromUserId(users[1].id);

      expect(result).toEqual([]);
    });
  });

  describe('_removeSocketIdFromUser', () => {
    it('return true if success', async () => {
      const socketId = 'socketId';
      const user = await createUser();
      const dto = {
        userId: user.id,
        socketId,
      };
      await socketGateway._saveSocketId(dto);

      const result = await socketGateway._removeSocketIdFromUser(
        user.id,
        socketId,
      );

      expect(result).toBeTruthy();
    });
  });
});

describe('outbound methods', () => {
  describe('broadcastToClients', () => {
    it('send message successfully', (done) => {
      jest
        .spyOn(socketGateway, 'handleConnection')
        .mockImplementation(() => Promise.resolve(new Server()) as any);
      const expectedValue = 'expectedValue';
      const messageKey = 'test';
      socketIoClientFactory(port).then((socket) => {
        socket
          .on('connect', () => {
            socketGateway.broadcastToClients(messageKey, expectedValue);
          })
          .on(messageKey, (data) => {
            expect(data).toEqual(expectedValue);
            socket.close();
            done();
          });
      });
    });
  });

  describe('sendToClientBySocketId', () => {
    it('send message successfully', (done) => {
      jest
        .spyOn(socketGateway, 'handleConnection')
        .mockImplementation(() => Promise.resolve(new Server()) as any);
      const messageKey = 'test';
      const expectedValue = 'expectedValue';
      socketIoClientFactory(port).then((socket) => {
        socket
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
            socket.close();
            done();
          });
      });
    });
  });
});
