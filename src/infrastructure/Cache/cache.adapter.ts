import { CacheSetParams, CacheSetManyParams } from './cache.types';

export abstract class CacheAdapter {
  abstract get<T = unknown>(key: string): Promise<T | null>;
  abstract set(params: CacheSetParams): Promise<void>;
  abstract setMany(params: CacheSetManyParams): Promise<void>;
  abstract del(key: string): Promise<void>;
  abstract delMany(keys: string[]): Promise<void>;
  abstract has(key: string): Promise<boolean>;
  abstract flush(): Promise<void>;
}
