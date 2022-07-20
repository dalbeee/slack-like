import { Test, TestingModule } from '@nestjs/testing';

import { MessageModule } from '@src/message/message.module';
import { PrismaService } from '@src/prisma.service';
import { RedisModule } from '@src/redis/redis.module';
import { UserModule } from '@src/user/user.module';
import { SocketIOGateway } from './socketio.gateway';
import { SocketIOService } from './socketio.service';

let app: TestingModule;
let socketIOService: SocketIOService;
let prisma: PrismaService;

beforeAll(async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [MessageModule, UserModule, RedisModule],
    providers: [PrismaService, SocketIOGateway, SocketIOService],
  }).compile();
  app = await moduleRef.init();
  socketIOService = app.get(SocketIOService);
  prisma = app.get(PrismaService);
});
afterEach(async () => {
  await prisma.clearDatabase();
});
afterAll(async () => {
  await prisma.$disconnect();
  await app.close();
});
