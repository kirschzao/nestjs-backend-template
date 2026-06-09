import { Module, Global } from '@nestjs/common';
import { CacheAdapter } from './cache.adapter';
import { CacheIntegration } from './application/cache.integration';

@Global()
@Module({
  providers: [
    {
      provide: CacheAdapter,
      useClass: CacheIntegration,
    },
  ],
  exports: [CacheAdapter],
})
export class CacheModule {}
