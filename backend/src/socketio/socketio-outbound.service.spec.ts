import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { SocketIoModule } from './socketio.module';
import { SocketIoOutboundService } from './socketio-outbound.service';
import { socketIoClientFactory } from './__test__/socketIoClientFactory';
import { SocketIoGateway } from './socketio.gateway';
import { Server } from 'socket.io';

let app: INestApplication;
let socketIoGateway: SocketIoGateway;
let socketIoOutboundService: SocketIoOutboundService;
let port: number;

beforeAll(async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [SocketIoModule],
  }).compile();
  app = moduleRef.createNestApplication();
  await app.init();
  socketIoGateway = app.get(SocketIoGateway);
  socketIoOutboundService = app.get(SocketIoOutboundService);
  port = app.getHttpServer().listen().address().port;
});
afterAll(async () => {
  await app.close();
});

describe.only('sendToClient', () => {
  it('send success', (done) => {
    jest
      .spyOn(socketIoGateway, 'handleConnection')
      .mockImplementation(() => Promise.resolve(new Server()) as any);
    const messageKey = 'messagekey';
    const expectedData = { hello: 'world' };

    socketIoClientFactory(port).then((socket) => {
      socket
        .on('connect', () => {
          socketIoOutboundService.sendToClient(
            { messageKey, socketId: socket.id },
            expectedData,
          );
        })
        .on(messageKey, (data) => {
          expect(data).toEqual(expectedData);
          socket.close();
          done();
        });
    });
  });
});
