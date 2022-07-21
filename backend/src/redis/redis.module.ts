import { Module } from '@nestjs/common';
import { RedisProviders } from './redis.provider';

import { RedisService } from './redis.service';

@Module({
  providers: [RedisService, RedisProviders],
  exports: [RedisService, RedisProviders],
})
export class RedisModule {}
