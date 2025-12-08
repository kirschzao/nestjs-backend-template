import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Socket } from 'socket.io';
import { AccountRepository } from '@/modules/Account/domain/account.repository';
import { Env } from '@/global/env.schema';
import { ExceptionsAdapter } from '@/infrastructure/Exceptions/exceptions.adapter';
import { UserRepository } from '@/modules/User/domain/user.repository';
import { RefreshTokenPayload } from '@/global/common/strategies/refresh-token-payload.dto';

@Injectable()
export class WsJwtStrategy extends PassportStrategy(Strategy, 'ws-jwt') {
  constructor(
    private readonly UserRepository: UserRepository,
    private readonly AccountRepository: AccountRepository,
    private readonly ExceptionsAdapter: ExceptionsAdapter,
    private readonly ConfigService: ConfigService<Env, true>,
  ) {
    const secret = ConfigService.get<string>('ACCESS_TOKEN_SECRET', {
      infer: true,
    });

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (client: Socket) => {
          const authHeader = client.handshake.headers.authorization;
          if (!authHeader) return null;
          return authHeader.split(' ')[1];
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: RefreshTokenPayload): Promise<RefreshTokenPayload> {
    const accountId = payload.sub;
    const user = await this.UserRepository.findUserById(accountId);
    if (!user) {
      throw this.ExceptionsAdapter.unauthorized({
        message: 'User not found with the provided ID',
      });
    }

    const account = await this.AccountRepository.getAccountById(accountId);
    if (!account) {
      throw this.ExceptionsAdapter.unauthorized({
        message: 'Account not found with the provided ID',
      });
    }

    return payload;
  }
}
