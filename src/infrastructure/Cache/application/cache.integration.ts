import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { CacheAdapter } from '@/infrastructure/Cache/cache.adapter';
import { CacheSetParams, CacheSetManyParams } from '@/infrastructure/Cache/cache.types';
import { LoggerAdapter } from '@/infrastructure/Logger/logger.adapter';

@Injectable()
export class CacheIntegration implements CacheAdapter, OnModuleDestroy {
  private readonly redis: Redis;

  constructor(
    private readonly ConfigService: ConfigService,
    private readonly LoggerAdapter: LoggerAdapter,
  ) {
    this.redis = new Redis({
      host: this.ConfigService.get<string>('REDIS_HOST'),
      port: Number(this.ConfigService.get<string>('REDIS_PORT') ?? 6379),
      maxRetriesPerRequest: 3,
    });

    this.redis.on('error', (error) => {
      this.LoggerAdapter.error({
        message: `Redis connection error: ${error.message}`,
        where: 'CacheIntegration',
      });
    });
  }

  async get<T = unknown>(key: string): Promise<T | null> {
    const value = await this.redis.get(key);

    if (!value) return null;

    try {
      return JSON.parse(value) as T;
    } catch {
      return value as T;
    }
  }

  async set(params: CacheSetParams): Promise<void> {
    const serialized = JSON.stringify(params.value);

    if (params.ttlInSeconds) {
      await this.redis.set(params.key, serialized, 'EX', params.ttlInSeconds);
    } else {
      await this.redis.set(params.key, serialized);
    }
  }

  async setMany(params: CacheSetManyParams): Promise<void> {
    const pipeline = this.redis.pipeline();

    for (const entry of params.entries) {
      const serialized = JSON.stringify(entry.value);

      if (entry.ttlInSeconds) {
        pipeline.set(entry.key, serialized, 'EX', entry.ttlInSeconds);
      } else {
        pipeline.set(entry.key, serialized);
      }
    }

    await pipeline.exec();
  }

  async del(key: string): Promise<void> {
    await this.redis.del(key);
  }

  async delMany(keys: string[]): Promise<void> {
    if (keys.length === 0) return;
    await this.redis.del(...keys);
  }

  async has(key: string): Promise<boolean> {
    const exists = await this.redis.exists(key);
    return exists === 1;
  }

  async flush(): Promise<void> {
    await this.redis.flushdb();
  }

  async ping(): Promise<boolean> {
    const result = await this.redis.ping();
    return result === 'PONG';
  }

  async onModuleDestroy(): Promise<void> {
    await this.redis.quit();
  }
}
