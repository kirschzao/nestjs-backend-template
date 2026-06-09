export interface CacheSetParams {
  key: string;
  value: unknown;
  ttlInSeconds?: number;
}

export interface CacheSetManyParams {
  entries: CacheSetParams[];
}
