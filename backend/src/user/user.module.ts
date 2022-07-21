import { forwardRef, Module } from '@nestjs/common';

import { ChannelModule } from '@src/channel/channel.module';
import { MessageModule } from '@src/message/message.module';
import { PrismaService } from '@src/prisma.service';
import { RedisModule } from '@src/redis/redis.module';
import { UserController } from '@src/user/user.controller';
import { UserService } from '@src/user/user.service';
import { UserRedisService } from './user-redis.service';

@Module({
  imports: [RedisModule, forwardRef(() => MessageModule), ChannelModule],
  controllers: [UserController],
  providers: [UserService, UserRedisService, PrismaService],
  exports: [UserService, UserRedisService],
})
export class UserModule {}
