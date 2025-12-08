import { Injectable } from '@nestjs/common';
import { ExceptionsAdapter } from '@/infrastructure/Exceptions/exceptions.adapter';
import { UserRepository } from '@/modules/User/domain/user.repository';
import { SendEmailAdapter } from '@/infrastructure/SendEmail/sendEmail.adapter';
import { ResetPasswordTokenRepository } from '@/modules/Auth/resetPassword/domain/reset-password-token.repository';
import { ResetPasswordRequestDTO } from '@/modules/Auth/resetPassword/application/dtos/request-token.dto';
import { ResetPasswordToken } from '../../domain/reset-password-token.entity';
import { UserExceptions } from '@/infrastructure/Exceptions/exceptions.types';
@Injectable()
export class RequestResetPasswordService {
  constructor(
    private readonly ExceptionsAdapter: ExceptionsAdapter,
    private readonly UserRepository: UserRepository,
    private readonly ResetPasswordTokenRepository: ResetPasswordTokenRepository,
    private readonly SendEmailAdapter: SendEmailAdapter,
  ) {}

  async execute(ResetPasswordRequestDTO: ResetPasswordRequestDTO): Promise<ResetPasswordToken> {
    const user = await this.UserRepository.findUserByEmail(ResetPasswordRequestDTO.email);
    if (!user) {
      throw this.ExceptionsAdapter.notFound({
        message: 'User not found',
        internalKey: UserExceptions.USER_NOT_FOUND,
      });
    }

    const generatedTokenResetPassword = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, '0');

    const ResetToken = new ResetPasswordToken({
      userId: user.id,
      token: generatedTokenResetPassword,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      isRevoked: false,
    });

    const CreatedResetToken =
      await this.ResetPasswordTokenRepository.createResetPasswordToken(ResetToken);

    await this.SendEmailAdapter.sendEmailResetPassword(
      user.email,
      generatedTokenResetPassword,
      user.name,
    );

    return CreatedResetToken;
  }
}
