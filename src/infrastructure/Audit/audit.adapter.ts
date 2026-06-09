import { AuditEvent } from './audit.types';

export abstract class AuditAdapter {
  abstract log(event: AuditEvent): void;
}
