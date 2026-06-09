import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { AuditAdapter } from '@/infrastructure/Audit/audit.adapter';
import { AuditAction, AuditEvent } from '@/infrastructure/Audit/audit.types';

const METHOD_ACTION_MAP: Record<string, AuditAction> = {
  POST: 'CREATE',
  PUT: 'UPDATE',
  PATCH: 'UPDATE',
  DELETE: 'DELETE',
};

const SENSITIVE_FIELDS = ['password', 'token', 'secret', 'refreshToken', 'accessToken'];

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private readonly AuditAdapter: AuditAdapter) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body, user } = request;

    const action = METHOD_ACTION_MAP[method];
    if (!action) return next.handle();

    const start = Date.now();

    const buildEvent = (statusCode: number): AuditEvent => ({
      timestamp: new Date().toISOString(),
      userId: user?.sub ?? null,
      userRole: user?.userRole ?? null,
      action,
      method,
      path: url,
      statusCode,
      durationMs: Date.now() - start,
      body: this.sanitizeBody(body),
    });

    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse();
        this.AuditAdapter.log(buildEvent(response.statusCode));
      }),
      catchError((error) => {
        this.AuditAdapter.log(buildEvent(error.status || 500));
        return throwError(() => error as Error);
      }),
    );
  }

  private sanitizeBody(body: unknown): Record<string, unknown> | undefined {
    if (!body || typeof body !== 'object' || Array.isArray(body)) return undefined;

    const sanitized = { ...(body as Record<string, unknown>) };

    for (const field of SENSITIVE_FIELDS) {
      if (field in sanitized) {
        sanitized[field] = '****';
      }
    }

    return sanitized;
  }
}
