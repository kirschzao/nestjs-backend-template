import { RefreshToken as PrismaRefreshToken } from '@prisma/client';
import { RefreshToken } from '@/modules/Auth/login/domain/refresh-token.entity';

export class RefreshTokenMapper {
  static toDomain(refreshToken: PrismaRefreshToken): RefreshToken {
    const model = new RefreshToken(
      {
        token: refreshToken.token,
        accountId: refreshToken.accountId,
        createdAt: refreshToken.createdAt,
        expiresAt: refreshToken.expiresAt,
        isRevoked: refreshToken.isRevoked,
      },
      refreshToken.id,
    );

    return model;
  }

  static toPersistence(refreshToken: RefreshToken): PrismaRefreshToken {
    return {
      id: refreshToken.id,
      token: refreshToken.token,
      accountId: refreshToken.accountId,
      createdAt: refreshToken.createdAt,
      expiresAt: refreshToken.expiresAt,
      isRevoked: refreshToken.isRevoked,
    };
  }
}
