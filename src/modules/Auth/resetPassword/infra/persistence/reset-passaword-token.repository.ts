import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infrastructure/Database/prisma.service';
import { ResetPasswordTokenRepository } from '@/modules/Auth/resetPassword/domain/reset-password-token.repository';
import { ResetPasswordToken } from '@/modules/Auth/resetPassword/domain/reset-password-token.entity';
import { ResetPasswordTokenMapper } from '@/modules/Auth/resetPassword/infra/persistence/reset-passaword-token.mapper';

@Injectable()
export class PrismaResetPasswordTokenRepository implements ResetPasswordTokenRepository {
  constructor(private readonly PrismaService: PrismaService) {}

  public async createResetPasswordToken(
    resetPasswordToken: ResetPasswordToken,
  ): Promise<ResetPasswordToken> {
    const prismaToken = ResetPasswordTokenMapper.toPersistence(resetPasswordToken);
    const createdToken = await this.PrismaService.resetPasswordToken.create({
      data: prismaToken,
    });
    return ResetPasswordTokenMapper.toDomain(createdToken);
  }

  public async findValidResetPasswordToken(id: string): Promise<ResetPasswordToken | null> {
    const prismaToken = await this.PrismaService.resetPasswordToken.findFirst({
      where: {
        id,
        isRevoked: false,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    if (!prismaToken) {
      return null;
    }

    return ResetPasswordTokenMapper.toDomain(prismaToken);
  }

  public async revokeResetPasswordTokenById(id: string): Promise<boolean> {
    const result = await this.PrismaService.resetPasswordToken.updateMany({
      where: {
        id,
        isRevoked: false,
      },
      data: {
        isRevoked: true,
      },
    });

    return result.count > 0;
  }
}
