import { Injectable } from '@nestjs/common';
import { RefreshToken } from '@/modules/Auth/login/domain/refresh-token.entity';
import { RefreshTokenRepository } from '@/modules/Auth/login/domain/refresh-token.repository';
import { PrismaService } from '@/infrastructure/Database/prisma.service';
import { RefreshTokenMapper } from '@/modules/Auth/login/infra/persistence/refresh-token.mapper';

@Injectable()
export class PrismaRefreshTokenRepository implements RefreshTokenRepository {
  constructor(private readonly prisma: PrismaService) {}

  public async createRefreshToken(refreshToken: RefreshToken): Promise<void> {
    const data = RefreshTokenMapper.toPersistence(refreshToken);
    await this.prisma.refreshToken.create({
      data: data,
    });
  }

  public async findValidRefreshTokenByAccountId(accountId: string): Promise<RefreshToken | null> {
    const refreshToken = await this.prisma.refreshToken.findFirst({
      where: {
        accountId: accountId,
        isRevoked: false,
      },
    });

    return refreshToken ? RefreshTokenMapper.toDomain(refreshToken) : null;
  }

  public async revokeAllRefreshTokensByAccountId(accountId: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: {
        accountId: accountId,
        isRevoked: false,
      },
      data: {
        isRevoked: true,
      },
    });
  }

  public async revokeRefreshTokenById(id: string): Promise<void> {
    await this.prisma.refreshToken.update({
      where: { id: id },
      data: { isRevoked: true },
    });
  }
}
