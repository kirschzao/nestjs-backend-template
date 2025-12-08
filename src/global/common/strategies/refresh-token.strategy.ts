import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { Env } from '@/global/env.schema';
import { ConfigService } from '@nestjs/config';
import { RefreshTokenPayload } from '@/global/common/strategies/refresh-token-payload.dto';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'refresh-token') {
  constructor(configService: ConfigService<Env, true>) {
    const secret = configService.get<string>('REFRESH_TOKEN_SECRET', {
      infer: true,
    });
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([(req: Request) => req.cookies['refreshToken']]),
      secretOrKey: secret,
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: RefreshTokenPayload): RefreshTokenPayload {
    const refreshToken = req.cookies['refreshToken'];

    return {
      sub: payload.sub,
      userRole: payload.userRole,
      accountStatus: payload.accountStatus,
      isOnboarded: true,
      iat: payload.iat,
      exp: payload.exp,
      refreshToken,
    };
  }
}
