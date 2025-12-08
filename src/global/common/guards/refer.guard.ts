import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RefererGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const allowedReferers = this.reflector.get<string[]>('allowedReferers', context.getHandler());

    if (!Array.isArray(allowedReferers) || allowedReferers.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const referer = request.headers.referer;

    if (
      typeof referer !== 'string' ||
      !allowedReferers.some((allowed) => referer.includes(allowed))
    ) {
      throw new ForbiddenException('Access Denied: Invalid Referer');
    }

    return true;
  }
}
