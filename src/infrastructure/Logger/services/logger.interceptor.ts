import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP Calls');

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest();
    const { method, url, body } = request;

    const now = Date.now();

    if (typeof body === 'object' && body !== null && !Array.isArray(body)) {
      const bodyToLog = { ...body };

      if (bodyToLog.password) {
        bodyToLog.password = '****';
      }
      this.logger.verbose(`[Request] ${method} ${url} - Body: ${JSON.stringify(bodyToLog)}`);
    } else {
      this.logger.verbose(`[Request] ${method} ${url} - (No Body)`);
    }

    return next.handle().pipe(
      tap(() => {
        const response = httpContext.getResponse();
        const duration = Date.now() - now;

        this.logger.log(
          `[Response] ${method} ${url} - Status: ${response.statusCode} - Duração: ${duration}ms`,
        );
      }),
      catchError((error) => {
        const duration = Date.now() - now;
        const statusCode = error.status || 500;

        if (statusCode >= 500) {
          this.logger.error(
            `${method} ${url} - Status: ${statusCode} - Duração: ${duration}ms - Erro: ${error.message}`,
          );
        } else {
          this.logger.warn(
            `${method} ${url} - Status: ${statusCode} - Duração: ${duration}ms - Erro: ${error.message}`,
          );
        }

        return throwError(() => error as Error);
      }),
    );
  }
}
