import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from '@src/prisma.service';
import { RedisService } from '@src/redis/redis.service';
import { ChannelSpecificDto } from './dto/channel-specific.dto';
import { SocketIoInboudService } from './socketio-inbound.service';
import { SocketIoModule } from './socketio.module';

let app: TestingModule;
let socketIoInboundService: SocketIoInboudService;
let prisma: PrismaService;
let redisService: RedisService;

beforeAll(async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [SocketIoModule],
  }).compile();
  app = await moduleRef.init();
  socketIoInboundService = app.get(SocketIoInboudService);
  prisma = app.get(PrismaService);
  redisService = app.get(RedisService);
});
afterEach(async () => {
  await redisService.redis.flushall();
  await prisma.clearDatabase();
});
afterAll(async () => {
  await prisma.$disconnect();
  await app.close();
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
