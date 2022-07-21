import { Provider } from '@nestjs/common';
import Redis from 'ioredis';

export const RedisProviders: Provider = {
  provide: 'REDIS',
  useFactory: (): Redis => {
    return new Redis({
      host: 'localhost',
      port: 6379,
    });
  },
};
