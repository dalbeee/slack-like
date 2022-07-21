import { Test, TestingModule } from '@nestjs/testing';
import Redis from 'ioredis';

import { MessageModule } from '@src/message/message.module';
import { PrismaService } from '@src/prisma.service';
import { RedisModule } from '@src/redis/redis.module';
import { UserModule } from '@src/user/user.module';
import { ChannelSpecificDto } from './dto/channel-specific.dto';
import { SocketIoGateway } from './socketio.gateway';
import { SocketIoInboudService } from './socketio-inbound.service';

let app: TestingModule;
let socketIOService: SocketIoInboudService;
let prisma: PrismaService;

beforeAll(async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [MessageModule, UserModule, RedisModule],
    providers: [PrismaService, SocketIoGateway, SocketIoInboudService],
  }).compile();
  app = await moduleRef.init();
  socketIOService = app.get(SocketIoInboudService);
  prisma = app.get(PrismaService);
});
afterEach(async () => {
  await new Redis(6379, 'localhost').flushall();
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
    const result = await socketIOService.increaseUnreadMessageCount(dto);

    expect(result).toEqual(1);
  });
});

describe('setZeroUnreadMessageCount', () => {
  it('return value if success', async () => {
    const dto: ChannelSpecificDto = {
      channelId: 'channelId',
      workspaceId: 'workspaceId',
      userId: 'userId',
    };
    const result = await socketIOService.setZeroUnreadMessageCount(dto);

    expect(result).toEqual(0);
  });
});
