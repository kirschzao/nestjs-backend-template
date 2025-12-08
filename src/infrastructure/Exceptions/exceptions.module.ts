import { Global, Module } from '@nestjs/common';
import { ExceptionsAdapter } from '@/infrastructure/Exceptions/exceptions.adapter';
import { ExceptionsIntegration } from '@/infrastructure/Exceptions/services/exceptions.integration';

@Global()
@Module({
  providers: [
    {
      provide: ExceptionsAdapter,
      useClass: ExceptionsIntegration,
    },
  ],
  exports: [ExceptionsAdapter],
})
export class ExceptionModule {}
