import { Injectable } from '@nestjs/common';
import { Token2Fa } from '@/modules/Auth/signup/domain/2fa-token.entity';
import { Token2FARepository } from '@/modules/Auth/signup/domain/2fa-token.repository';
import { PrismaService } from '@/infrastructure/Database/prisma.service';
import { Token2FAMapper } from '@/modules/Auth/signup/infra/persistence/2fa-token.mapper';

@Injectable()
export class PrismaToken2FaRepository implements Token2FARepository {
  constructor(private readonly prisma: PrismaService) {}

  public async createToken2FA(token2Fa: Token2Fa): Promise<Token2Fa> {
    const data = Token2FAMapper.toPersistence(token2Fa);
    const resultToken = await this.prisma.token2FA.create({
      data: data,
    });
    return Token2FAMapper.toDomain(resultToken);
  }

  public async findValidToken2FA(id: string): Promise<Token2Fa | null> {
    const token2Fa = await this.prisma.token2FA.findFirst({
      where: {
        id: id,
      },
    });
    return token2Fa ? Token2FAMapper.toDomain(token2Fa) : null;
  }

  public async revokeRefreshTokenById(id: string): Promise<boolean> {
    await this.prisma.token2FA.update({
      where: { id: id },
      data: { isRevoked: true },
    });
    return true;
  }
}
