import { Injectable, Logger } from '@nestjs/common';
import { AuditAdapter } from '@/infrastructure/Audit/audit.adapter';
import { AuditEvent } from '@/infrastructure/Audit/audit.types';

@Injectable()
export class AuditIntegration implements AuditAdapter {
  private readonly logger = new Logger('Audit');

  log(event: AuditEvent): void {
    this.logger.log(JSON.stringify(event));
  }
}
