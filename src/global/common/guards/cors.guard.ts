import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

function getCors(): string[] {
  const corsEnv = process.env.CORS;
  if (!corsEnv) {
    return ['http://localhost:5173'];
  }
  return corsEnv.split(',');
}

@Injectable()
export class CorsGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const allowedDomains = getCors();
    const request = context.switchToHttp().getRequest();
    const origin = request.headers.origin;

    if (typeof origin !== 'string' || !allowedDomains.includes(origin)) {
      throw new ForbiddenException('Access Denied: Invalid Referer');
    }

    return true;
  }
}
