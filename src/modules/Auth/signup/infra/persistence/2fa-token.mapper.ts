import { Token2FA as PrismaToken2FA } from '@prisma/client';
import { Token2Fa, UserInfo2Fa } from '@/modules/Auth/signup/domain/2fa-token.entity';

export class Token2FAMapper {
  static toDomain(prismaToken2FA: PrismaToken2FA): Token2Fa {
    const userInfo2Fa: UserInfo2Fa = {
      email: prismaToken2FA.userEmail,
      name: prismaToken2FA.userName ?? undefined,
      password: prismaToken2FA.userPassword ?? undefined,
    };

    const token2Fa = new Token2Fa(
      {
        token: prismaToken2FA.token,
        createdAt: prismaToken2FA.createdAt,
        expiresAt: prismaToken2FA.expiresAt,
        isRevoked: prismaToken2FA.isRevoked,
      },
      userInfo2Fa,
      prismaToken2FA.id,
    );

    return token2Fa;
  }

  static toPersistence(token2Fa: Token2Fa): PrismaToken2FA {
    return {
      id: token2Fa.id,
      token: token2Fa.token,
      createdAt: token2Fa.createdAt,
      expiresAt: token2Fa.expiresAt,
      isRevoked: token2Fa.isRevoked,
      userEmail: token2Fa.userInfo2Fa.email,
      userName: token2Fa.userInfo2Fa?.name ?? null,
      userPassword: token2Fa.userInfo2Fa?.password ?? null,
    };
  }
}
