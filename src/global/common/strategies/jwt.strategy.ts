import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { RefreshTokenPayload } from '@/global/common/strategies/refresh-token-payload.dto';
import { AccountRepository } from '@/modules/Account/domain/account.repository';
import { Env } from '@/global/env.schema';
import { ExceptionsAdapter } from '@/infrastructure/Exceptions/exceptions.adapter';
import { UserRepository } from '@/modules/User/domain/user.repository';
import { LoggerAdapter } from '@/infrastructure/Logger/logger.adapter';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly LogggerAdapter: LoggerAdapter,
    private readonly UserRepository: UserRepository,
    private readonly AccountRepository: AccountRepository,
    private readonly ExceptionsAdapter: ExceptionsAdapter,
    private readonly ConfigService: ConfigService<Env, true>,
  ) {
    const secret = ConfigService.get<string>('ACCESS_TOKEN_SECRET', {
      infer: true,
    });

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: RefreshTokenPayload): Promise<RefreshTokenPayload> {
    const accountId = payload.sub;
    const user = await this.UserRepository.findUserById(accountId);
    if (!user) {
      this.LogggerAdapter.verbose({
        where: 'JWT Strategy  -Validate',
        message: `User not found with ID: ${accountId}, throwing unauthorized`,
      });
      throw this.ExceptionsAdapter.unauthorized({
        message: 'User not found with the provided ID',
      });
    }

    const account = await this.AccountRepository.getAccountById(accountId);
    if (!account) {
      this.LogggerAdapter.verbose({
        where: 'JWT Strategy',
        message: `Account not found with ID: ${accountId}, throwing unauthorized`,
      });
      throw this.ExceptionsAdapter.unauthorized({
        message: 'Account not found with the provided ID',
      });
    }

    return payload;
  }
}
