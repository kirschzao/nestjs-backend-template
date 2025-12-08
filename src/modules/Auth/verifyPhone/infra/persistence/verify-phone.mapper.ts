import { VerifyPhoneToken as PrismaToken } from '@prisma/client';
import { VerifyPhoneToken } from '@/modules/Auth/verifyPhone/domain/verify-phone-token.entity';

export class VerifyPhoneMapper {
  static toDomain(prismaToken: PrismaToken): VerifyPhoneToken {
    const verifyPhoneToken = new VerifyPhoneToken(
      {
        userId: prismaToken.userId,
        token: prismaToken.token,
        phone: prismaToken.phone,
        createdAt: prismaToken.createdAt,
        expiresAt: prismaToken.expiresAt,
        isRevoked: prismaToken.isRevoked,
      },
      prismaToken.id,
    );

    return verifyPhoneToken;
  }

  static toPersistence(verifyPhoneToken: VerifyPhoneToken): PrismaToken {
    return {
      id: verifyPhoneToken.id,
      userId: verifyPhoneToken.userId,
      token: verifyPhoneToken.token,
      phone: verifyPhoneToken.phone,
      createdAt: verifyPhoneToken.createdAt,
      expiresAt: verifyPhoneToken.expiresAt,
      isRevoked: verifyPhoneToken.isRevoked,
    };
  }
}
