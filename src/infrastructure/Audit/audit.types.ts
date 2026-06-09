export type AuditAction = 'CREATE' | 'UPDATE' | 'DELETE' | 'CUSTOM';

export interface AuditEvent {
  timestamp: string;
  userId: string | null;
  userRole: string | null;
  action: AuditAction;
  method: string;
  path: string;
  statusCode: number;
  durationMs: number;
  body?: Record<string, unknown>;
}
