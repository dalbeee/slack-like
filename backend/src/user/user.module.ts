import { Module } from '@nestjs/common';

import { PrismaService } from '@src/prisma.service';
import { RedisModule } from '@src/redis/redis.module';
import { UserController } from '@src/user/user.controller';
import { UserService } from '@src/user/user.service';

@Module({
  imports: [RedisModule],
  controllers: [UserController],
  providers: [UserService, PrismaService],
  exports: [UserService],
})
export class UserModule {}
