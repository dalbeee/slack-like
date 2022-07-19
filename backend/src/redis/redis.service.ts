import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  redis: Redis;
  constructor() {
    this.redis = new Redis(6379, 'localhost');
  }

  _parseString(string: string) {
    try {
      return JSON.parse(string);
    } catch {
      return string;
    }
  }

  async hSet(key: string, field: string, value: string | number | object) {
    const parsedValue = value instanceof Object ? JSON.stringify(value) : value;
    await this.redis.hset(key, field, parsedValue);
    return await this.hGet(key, field);
  }

  async hGet<T = any>(key: string, field: string) {
    const r = await this.redis.hget(key, field);
    return this._parseString(r) as T;
  }

  async hAppend(key: string, field: string, value: string | number | object) {
    const existData = await this.hGet(key, field);
    const data =
      existData && value instanceof Object && existData instanceof Object
        ? { ...existData, ...value }
        : value;
    return this.hSet(key, field, data || value);
  }

  async hmSet(key: string, object: object) {
    Object.keys(object).forEach((k) => {
      this.hSet(key, k, object[k]);
    });
    return;
  }

  async hGetAll<T = any>(key: string): Promise<T> {
    const r = await this.redis.hgetall(key);
    const k = Object.keys(r);
    const result = k.reduce(
      (acc, k) => ({ ...acc, [k]: this._parseString(r[k]) }),
      {},
    );
    return result as T;
  }
}
