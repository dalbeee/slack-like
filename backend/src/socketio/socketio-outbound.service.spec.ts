import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from '@src/prisma.service';
import { SocketIoModule } from './socketio.module';
import { SocketIoOutboundService } from './socketio-outbound.service';
import { RedisService } from '@src/redis/redis.service';

let app: TestingModule;
let socketIoOutboundService: SocketIoOutboundService;
let prisma: PrismaService;
let redisService: RedisService;

beforeAll(async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [SocketIoModule],
  }).compile();
  app = await moduleRef.init();
  socketIoOutboundService = app.get(SocketIoOutboundService);
  prisma = app.get(PrismaService);
  redisService = app.get(RedisService);
});
afterEach(async () => {
  await prisma.clearDatabase();
  await redisService.redis.flushall();
});
afterAll(async () => {
  await prisma.$disconnect();
  await app.close();
});

describe('none', () => {
  it('', async () => {
    return;
  });
});
