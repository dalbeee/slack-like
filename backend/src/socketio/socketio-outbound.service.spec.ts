import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { SocketIoModule } from './socketio.module';
import { SocketIoOutboundService } from './socketio-outbound.service';
import { socketIoClientFactory } from './__test__/socketIoClientFactory';

let app: INestApplication;
let socketIoOutboundService: SocketIoOutboundService;

beforeAll(async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [SocketIoModule],
  }).compile();
  app = moduleRef.createNestApplication();
  await app.init();
  socketIoOutboundService = app.get(SocketIoOutboundService);
});
afterAll(async () => {
  await app.close();
});

describe('sendToClient', () => {
  it('send success', (done) => {
    const messageKey = 'messagekey';
    const expectedData = { hello: 'world' };

    const socket = socketIoClientFactory(app)
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
