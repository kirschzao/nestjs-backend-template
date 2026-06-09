import { Module, Global } from '@nestjs/common';
import { AuditAdapter } from './audit.adapter';
import { AuditIntegration } from './application/audit.integration';

@Global()
@Module({
  providers: [
    {
      provide: AuditAdapter,
      useClass: AuditIntegration,
    },
  ],
  exports: [AuditAdapter],
})
export class AuditModule {}
