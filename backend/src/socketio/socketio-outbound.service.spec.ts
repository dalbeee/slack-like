import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from '@src/prisma.service';
import { SocketIoModule } from './socketio.module';
import { SocketIoOutboundService } from './socketio-outbound.service';
import { RedisService } from '@src/redis/redis.service';
import { createUser } from '@src/user/__test__/createUser';
import { createMessage } from '@src/message/__test__/createMessage';
import { createChannel } from '@src/channel/__test__/createChannel';
import { createWorkspace } from '@src/workspace/__test__/createWorkspace';
import { UserRedisService } from '@src/user/user-redis.service';

let app: TestingModule;
let socketIoOutboundService: SocketIoOutboundService;
let prisma: PrismaService;
let redisService: RedisService;
let userRedisService: UserRedisService;

beforeAll(async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [SocketIoModule],
  }).compile();
  app = await moduleRef.init();
  socketIoOutboundService = app.get(SocketIoOutboundService);
  prisma = app.get(PrismaService);
  redisService = app.get(RedisService);
  userRedisService = app.get(UserRedisService);
});
afterEach(async () => {
  await prisma.clearDatabase();
  await redisService.redis.flushall();
});
afterAll(async () => {
  await app.close();
});

describe('sendToClient', () => {
  it('  if success', async () => {
    const user = await createUser();
    const workspace = await createWorkspace();
    const channel = await createChannel({ workspaceId: workspace.id });
    const message = await createMessage({
      channelId: channel.id,
      userId: user.id,
      workspaceId: workspace.id,
      content: 'hello',
    });
    await userRedisService.setSocketAt(user.id, 'socketId');

    const result = await socketIoOutboundService.sendToClient({
      messageId: message.id,
      workspaceId: workspace.id,
    });

    console.log(result);
  });
});
