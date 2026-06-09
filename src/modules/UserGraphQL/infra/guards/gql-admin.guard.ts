import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { RoleEnum } from '@/modules/User/domain/user.entity';

@Injectable()
export class GqlAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context);
    const user = ctx.getContext().req.user;

    if (user.userRole === String(RoleEnum.ADMIN)) {
      return true;
    }

    throw new ForbiddenException();
  }
}
