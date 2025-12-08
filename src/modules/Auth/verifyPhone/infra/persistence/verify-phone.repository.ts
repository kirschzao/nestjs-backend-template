import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infrastructure/Database/prisma.service';
import { VerifyPhoneToken } from '@/modules/Auth/verifyPhone/domain/verify-phone-token.entity';
import { VerifyPhoneMapper } from '@/modules/Auth/verifyPhone/infra/persistence/verify-phone.mapper';
import { VerifyPhoneRepository } from '@/modules/Auth/verifyPhone/domain/verify-phone-repository';

@Injectable()
export class PrismaVerifyPhoneRepository implements VerifyPhoneRepository {
  constructor(private readonly prisma: PrismaService) {}

  public async createTokenVerifyPhone(
    verifyPhoneToken: VerifyPhoneToken,
  ): Promise<VerifyPhoneToken> {
    const data = VerifyPhoneMapper.toPersistence(verifyPhoneToken);
    const resultToken = await this.prisma.verifyPhoneToken.create({
      data: data,
    });
    return VerifyPhoneMapper.toDomain(resultToken);
  }

  public async findValidTokenVerifyPhone(id: string): Promise<VerifyPhoneToken | null> {
    const verifyPhoneToken = await this.prisma.verifyPhoneToken.findFirst({
      where: {
        id: id,
        isRevoked: false,
      },
    });
    return verifyPhoneToken ? VerifyPhoneMapper.toDomain(verifyPhoneToken) : null;
  }

  public async revokeTokenById(id: string): Promise<boolean> {
    await this.prisma.verifyPhoneToken.update({
      where: { id: id },
      data: { isRevoked: true },
    });
    return true;
  }
}
