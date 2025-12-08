import { Env } from '@/global/env.schema';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';

@Injectable()
export class N8nGuard implements CanActivate {
  private readonly expectedN8nSecret: string;

  constructor(private configService: ConfigService<Env, true>) {
    this.expectedN8nSecret = this.configService.get<string>('N8N_TOKEN_SECRET');
  }
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      console.error('[n8n.guard].CanActivate --> Missing Authorization header');
      throw new UnauthorizedException('[n8n.guard].CanActivate --> Missing Authorization header');
    }
    if (authHeader !== `Bearer ${this.expectedN8nSecret}`) {
      console.error('[n8n.guard].CanActivate --> Invalid N8N Authorization token');
      throw new ForbiddenException('Invalid N8N Authorization token');
    }
    return true;
  }
}
