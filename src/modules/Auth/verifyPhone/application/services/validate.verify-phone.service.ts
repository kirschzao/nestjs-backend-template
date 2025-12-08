import { Injectable } from '@nestjs/common';
import { ExceptionsAdapter } from '@/infrastructure/Exceptions/exceptions.adapter';
import { UserRepository } from '@/modules/User/domain/user.repository';
import { VerifyPhoneRepository } from '@/modules/Auth/verifyPhone/domain/verify-phone-repository';
import { LoggerAdapter } from '@/infrastructure/Logger/logger.adapter';
import { ValidateVerifyPhoneDTO } from '@/modules/Auth/verifyPhone/application/dtos/verify-phone-validate.dto';
import { VerifyPhoneToken } from '@/modules/Auth/verifyPhone/domain/verify-phone-token.entity';

@Injectable()
export class ValidateVerifyPhoneService {
  constructor(
    private readonly ExceptionsAdapter: ExceptionsAdapter,
    private readonly UserRepository: UserRepository,
    private readonly VerifyPhoneRepository: VerifyPhoneRepository,
    private readonly LoggerAdapter: LoggerAdapter,
  ) {}

  async execute(userId: string, validateVerifyPhoneDTO: ValidateVerifyPhoneDTO): Promise<void> {
    const verifyPhoneTokenData = await this.VerifyPhoneRepository.findValidTokenVerifyPhone(
      validateVerifyPhoneDTO.tokenId,
    );

    if (!verifyPhoneTokenData) {
      throw this.ExceptionsAdapter.unauthorized({
        message: 'Invalid or expired verification token',
      });
    }

    const user = await this.UserRepository.findUserById(userId);

    if (!user) {
      throw this.ExceptionsAdapter.notFound({
        message: 'User not found',
      });
    }

    const verifyPhoneToken = await this.validateVerifyPhoneToken(
      verifyPhoneTokenData,
      userId,
      validateVerifyPhoneDTO,
    );

    verifyPhoneToken.phone = this.normalizeBrazilPhone(verifyPhoneToken.phone);

    user.phone = verifyPhoneToken.phone;
    await this.UserRepository.updateUser(user);

    verifyPhoneToken.isRevoked = true;
    await this.VerifyPhoneRepository.revokeTokenById(verifyPhoneToken.id);

    this.LoggerAdapter.log({
      message: `Phone number ${user.phone} verified for user ${userId}`,
      where: 'ValidateVerifyPhoneService.execute',
    });
  }

  private normalizeBrazilPhone(phone: string): string {
    const digits = phone.replace(/\D/g, '');

    if (!digits.startsWith('55')) return digits;

    const country = '55';
    const ddd = digits.substring(2, 4);
    const rest = digits.substring(4);

    const withoutNine = rest.startsWith('9') ? rest.substring(1) : rest;

    return `${country}${ddd}${withoutNine}`;
  }

  private async validateVerifyPhoneToken(
    verifyPhoneToken: VerifyPhoneToken,
    userId: string,
    validateVerifyPhoneDTO: ValidateVerifyPhoneDTO,
  ): Promise<VerifyPhoneToken> {
    if (verifyPhoneToken.userId !== userId) {
      throw this.ExceptionsAdapter.unauthorized({
        message: 'Invalid or expired verification token',
      });
    }

    if (verifyPhoneToken.expiresAt < new Date()) {
      await this.VerifyPhoneRepository.revokeTokenById(verifyPhoneToken.id);
      throw this.ExceptionsAdapter.unauthorized({
        message: 'Verification token has expired',
      });
    }

    if (verifyPhoneToken.token !== validateVerifyPhoneDTO.token) {
      throw this.ExceptionsAdapter.unauthorized({
        message: 'Invalid verification code',
      });
    }

    return verifyPhoneToken;
  }
}
