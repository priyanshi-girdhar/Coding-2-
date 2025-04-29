import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { createClient } from 'redis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private client = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  });

  constructor() {
    this.client.connect();
  }

  async set(key: string, value: string, ttl?: number) {
    await this.client.set(key, value);
    if (ttl) await this.client.expire(key, ttl);
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async del(key: string) {
    await this.client.del(key);
  }

  async onModuleDestroy() {
    await this.client.quit();
  }

}
