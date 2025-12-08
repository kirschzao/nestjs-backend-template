import { Global, Module } from '@nestjs/common';
import { LoggerAdapter } from '@/infrastructure/Logger/logger.adapter';
import { LoggerIntegration } from '@/infrastructure/Logger/services/logger.integration';

@Global()
@Module({
  providers: [
    {
      provide: LoggerAdapter,
      useClass: LoggerIntegration,
    },
  ],
  exports: [LoggerAdapter],
})
export class LoggerModule {}
