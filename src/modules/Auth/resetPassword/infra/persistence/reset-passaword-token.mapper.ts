import { ResetPasswordToken as PrismaResetPasswordToken } from '@prisma/client';
import { ResetPasswordToken } from '@/modules/Auth/resetPassword/domain/reset-password-token.entity';

export class ResetPasswordTokenMapper {
  static toDomain(PrismaToken: PrismaResetPasswordToken): ResetPasswordToken {
    const Token = new ResetPasswordToken(
      {
        token: PrismaToken.token,
        createdAt: PrismaToken.createdAt,
        expiresAt: PrismaToken.expiresAt,
        isRevoked: PrismaToken.isRevoked,
        userId: PrismaToken.accountId,
      },
      PrismaToken.id,
    );
    return Token;
  }

  static toPersistence(ResetPasswordToken: ResetPasswordToken): PrismaResetPasswordToken {
    return {
      id: ResetPasswordToken.id,
      token: ResetPasswordToken.token,
      createdAt: ResetPasswordToken.createdAt,
      expiresAt: ResetPasswordToken.expiresAt,
      isRevoked: ResetPasswordToken.isRevoked,
      accountId: ResetPasswordToken.userId,
    };
  }
}
