import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { RoleEnum } from '@/modules/User/domain/user.entity';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    const user = request.user;

    if (user.userRole === String(RoleEnum.ADMIN)) {
      return true;
    }

    throw new ForbiddenException();
  }
}
