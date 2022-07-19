import { Test, TestingModule } from '@nestjs/testing';
import { MessageModule } from '@src/message/message.module';
import { UserModule } from '@src/user/user.module';
import { SocketIOGateway } from './socketio.gateway';
import { SocketIOService } from './socketio.service';

let app: TestingModule;
let socketGateway: SocketIOGateway;
let socketService: SocketIOService;

beforeAll(async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [MessageModule, UserModule],
    providers: [SocketIOGateway, SocketIOService],
  }).compile();
  app = await moduleRef.init();
  socketGateway = app.get(SocketIOGateway);
  socketService = app.get(SocketIOService);
});

afterAll(async () => {
  await app.close();
});

it('', async () => {
  expect(socketGateway.socketManager).toBeDefined();
});

it('save', async () => {
  socketGateway._saveSocketId({
    socketId: 'a',
    userId: 'a',
    workspaceId: 'a',
  });
});

it('findByUserId', async () => {
  socketGateway._saveSocketId({
    socketId: 'a',
    userId: 'a',
    workspaceId: 'a',
  });
  socketGateway._saveSocketId({
    socketId: 'b',
    userId: 'b',
    workspaceId: 'b',
  });

  const result = socketGateway._findSocketIdFromUserId('b');
  console.log(result);

  expect(result).toBeDefined();
});
