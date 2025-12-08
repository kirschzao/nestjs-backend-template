import { Injectable } from '@nestjs/common';
import { ExceptionsAdapter } from '@/infrastructure/Exceptions/exceptions.adapter';
import { VerifyPhoneToken } from '@/modules/Auth/verifyPhone/domain/verify-phone-token.entity';
import { UserRepository } from '@/modules/User/domain/user.repository';
import { VerifyPhoneRepository } from '@/modules/Auth/verifyPhone/domain/verify-phone-repository';
import { LoggerAdapter } from '@/infrastructure/Logger/logger.adapter';
import { VerifyPhoneRequestDTO } from '../dtos/verify-phone.dto';

@Injectable()
export class VerifyPhoneService {
  constructor(
    private readonly ExceptionsAdapter: ExceptionsAdapter,
    private readonly UserRepository: UserRepository,
    private readonly VerifyPhoneRepository: VerifyPhoneRepository,
    private readonly LoggerAdapter: LoggerAdapter,
  ) {}

  async execute(
    userId: string,
    VerifyPhoneRequest: VerifyPhoneRequestDTO,
  ): Promise<VerifyPhoneToken> {
    const user = await this.UserRepository.findUserById(userId);
    if (!user) {
      throw this.ExceptionsAdapter.notFound({
        message: 'User not found',
      });
    }

    if (user.phone) {
      throw this.ExceptionsAdapter.badRequest({
        message: 'User already has a verified phone number, delete it first to add a new one',
      });
    }

    const phoneInUse = await this.UserRepository.findUserByPhone(VerifyPhoneRequest.phone);

    if (phoneInUse) {
      throw this.ExceptionsAdapter.badRequest({
        message: 'This phone number is already in use',
      });
    }

    const generateToken = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, '0');

    const newVerifyPhoneToken = new VerifyPhoneToken({
      userId: userId,
      token: generateToken,
      phone: VerifyPhoneRequest.phone,
      createdAt: new Date(),
      expiresAt: new Date(new Date().getTime() + 10 * 60000),
      isRevoked: false,
    });

    const verifyPhoneToken =
      await this.VerifyPhoneRepository.createTokenVerifyPhone(newVerifyPhoneToken);

    await this.LoggerAdapter.log({
      message: `Verify phone token created for user ${userId} and phone number ${VerifyPhoneRequest.phone}: ${generateToken}`,
      where: 'VerifyPhoneService.execute',
    });

    return verifyPhoneToken;
  }
}
