import { Injectable } from '@nestjs/common';
import { ExceptionsAdapter } from '@/infrastructure/Exceptions/exceptions.adapter';
import { ValidateResetPasswordDTO } from '@/modules/Auth/resetPassword/application/dtos/validate.dto';
import { UserRepository } from '@/modules/User/domain/user.repository';
import { ResetPasswordTokenRepository } from '@/modules/Auth/resetPassword/domain/reset-password-token.repository';
import { UserExceptions, TokenExceptions } from '@/infrastructure/Exceptions/exceptions.types';

@Injectable()
export class IsValidateResetPasswordService {
  constructor(
    private readonly ExceptionsAdapter: ExceptionsAdapter,
    private readonly UserRepository: UserRepository,
    private readonly ResetPasswordTokenRepository: ResetPasswordTokenRepository,
  ) {}

  async execute(ValidateResetPasswordDTO: ValidateResetPasswordDTO): Promise<void> {
    const findToken = await this.ResetPasswordTokenRepository.findValidResetPasswordToken(
      ValidateResetPasswordDTO.tokenId,
    );

    if (!findToken) {
      throw this.ExceptionsAdapter.badRequest({
        message: 'Invalid or expired token',
        internalKey: TokenExceptions.TOKEN_INVALID,
      });
    }

    if (findToken.isRevoked) {
      throw this.ExceptionsAdapter.badRequest({
        message: 'This token has already been used',
        internalKey: TokenExceptions.TOKEN_INVALID,
      });
    }

    if (findToken.expiresAt < new Date()) {
      await this.ResetPasswordTokenRepository.revokeResetPasswordTokenById(findToken.id);
      throw this.ExceptionsAdapter.badRequest({
        message: 'This token has expired',
        internalKey: TokenExceptions.TOKEN_INVALID,
      });
    }

    if (findToken.token !== ValidateResetPasswordDTO.token) {
      throw this.ExceptionsAdapter.badRequest({
        message: 'Invalid token',
        internalKey: TokenExceptions.TOKEN_INVALID,
      });
    }

    const user = await this.UserRepository.findUserById(findToken.userId);
    if (!user) {
      throw this.ExceptionsAdapter.notFound({
        message: 'User not found',
        internalKey: UserExceptions.USER_NOT_FOUND,
      });
    }
  }
}
