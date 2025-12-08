import { Injectable } from '@nestjs/common';
import { TokensResponseInterface } from '@/modules/Auth/login/application/dtos/refreshToken';
import { RefreshToken } from '@/modules/Auth/login/domain/refresh-token.entity';
import { RefreshTokenRepository } from '@/modules/Auth/login/domain/refresh-token.repository';
import { UserRepository } from '@/modules/User/domain/user.repository';
import { ExceptionsAdapter } from '@/infrastructure/Exceptions/exceptions.adapter';
import { CryptographyAdapter } from '@/infrastructure/Criptography/cryptography.adapter';
import { JwtService } from '@nestjs/jwt';
import { StringValue } from 'ms';
import * as ms from 'ms';
import { ConfigService } from '@nestjs/config';
import { Env } from '@/global/env.schema';
import { UserExceptions, TokenExceptions } from '@/infrastructure/Exceptions/exceptions.types';
import { AccountRepository } from '@/modules/Account/domain/account.repository';
import { AccountStatus } from '@/modules/Account/domain/account.entity';
import { RoleEnum } from '@/modules/User/domain/user.entity';

@Injectable()
export class RefreshTokenService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly accountRepository: AccountRepository,
    private readonly exceptionsAdapter: ExceptionsAdapter,
    private readonly cryptographyAdapter: CryptographyAdapter,
    private readonly jwtService: JwtService,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly configService: ConfigService<Env, true>,
  ) {}

  async execute(userId: string, oldRefreshToken: string): Promise<TokensResponseInterface> {
    const user = await this.userRepository.findUserById(userId);
    if (!user) {
      throw this.exceptionsAdapter.notFound({
        message: 'User not found',
        internalKey: UserExceptions.USER_NOT_FOUND,
      });
    }

    const userRefreshToken =
      await this.refreshTokenRepository.findValidRefreshTokenByAccountId(userId);
    if (!userRefreshToken) {
      throw this.exceptionsAdapter.unauthorized({
        message: 'No valid refresh token found for user',
        internalKey: TokenExceptions.TOKEN_INVALID,
      });
    }

    const verifyToken = await this.cryptographyAdapter.compare({
      plainText: oldRefreshToken,
      cryptographedText: userRefreshToken.token,
    });

    if (!verifyToken) {
      await this.refreshTokenRepository.revokeAllRefreshTokensByAccountId(userId);
      throw this.exceptionsAdapter.unauthorized({
        message: 'Invalid refresh token',
        internalKey: TokenExceptions.TOKEN_INVALID,
      });
    }

    const account = await this.accountRepository.getAccountById(user.id);
    if (!account) {
      throw this.exceptionsAdapter.notFound({
        message: 'Account not found for the user',
      });
    }
    await this.refreshTokenRepository.revokeRefreshTokenById(userRefreshToken.id);

    return this.generateNewTokens({
      accountId: account.id,
      userRole: user.role,
      accountStatus: account.status,
    });
  }

  private async generateNewTokens(tokenParams: TokenParams): Promise<TokensResponseInterface> {
    const payload = {
      sub: tokenParams.accountId,
      userRole: tokenParams.userRole,
      accountStatus: tokenParams.accountStatus,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
        expiresIn: this.configService.get<string>('ACCESS_TOKEN_EXPIRATION') as StringValue,
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
        expiresIn: this.configService.get<string>('REFRESH_TOKEN_EXPIRATION') as StringValue,
      }),
    ]);

    const hashedToken = await this.cryptographyAdapter.hash({
      plainText: refreshToken,
      hashSalt: 8,
    });

    const expireInString = this.configService.get<string>('REFRESH_TOKEN_EXPIRATION');
    const expireInMs = ms(expireInString as StringValue);
    const expiresAt = new Date(Date.now() + expireInMs);

    const newRefreshToken = new RefreshToken({
      token: hashedToken,
      accountId: tokenParams.accountId,
      expiresAt,
      isRevoked: false,
      createdAt: new Date(),
    });

    await this.refreshTokenRepository.createRefreshToken(newRefreshToken);

    return { accessToken, refreshToken };
  }
}

interface TokenParams {
  accountId: string;
  userRole: RoleEnum;
  accountStatus: AccountStatus;
}
