import { Injectable } from '@nestjs/common';
import { ExceptionsAdapter } from '@/infrastructure/Exceptions/exceptions.adapter';
import { UserRepository } from '@/modules/User/domain/user.repository';
import { User } from '@/modules/User/domain/user.entity';
import { SendEmailAdapter } from '@/infrastructure/SendEmail/sendEmail.adapter';
import { ResetPasswordTokenRepository } from '@/modules/Auth/resetPassword/domain/reset-password-token.repository';
import { ResetPasswordDTO } from '@/modules/Auth/resetPassword/application/dtos/reset-password.dto';
import { CryptographyAdapter } from '@/infrastructure/Criptography/cryptography.adapter';
import { UserExceptions, TokenExceptions } from '@/infrastructure/Exceptions/exceptions.types';

@Injectable()
export class ResetPasswordService {
  constructor(
    private readonly ExceptionsAdapter: ExceptionsAdapter,
    private readonly UserRepository: UserRepository,
    private readonly ResetPasswordTokenRepository: ResetPasswordTokenRepository,
    private readonly SendEmailAdapter: SendEmailAdapter,
    private readonly CryptographyAdapter: CryptographyAdapter,
  ) {}

  async execute(ResetPasswordDTO: ResetPasswordDTO): Promise<void> {
    const findToken = await this.ResetPasswordTokenRepository.findValidResetPasswordToken(
      ResetPasswordDTO.tokenId,
    );

    if (!findToken) {
      throw this.ExceptionsAdapter.badRequest({
        message: 'Invalid or expired token',
        internalKey: TokenExceptions.TOKEN_EXPIRED,
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
        internalKey: TokenExceptions.TOKEN_EXPIRED,
      });
    }

    if (findToken.token !== ResetPasswordDTO.token) {
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

    if (!this.isSafetyPassword(ResetPasswordDTO.newPassword)) {
      throw this.ExceptionsAdapter.badRequest({
        message: 'Your password is not strong enough',
        internalKey: UserExceptions.USER_NOT_SAFETY_PASSWORD,
      });
    }

    const hashedPassword = await this.CryptographyAdapter.hash({
      plainText: ResetPasswordDTO.newPassword,
      hashSalt: 8,
    });

    await this.UserRepository.updateUser(
      new User(
        {
          name: user.name,
          email: user.email,
          password: hashedPassword,
          cpf: user.cpf,
          phone: user.phone,
          role: user.role,
        },
        user.id,
      ),
    );

    await this.SendEmailAdapter.sendEmailPaswordChanged(user.email, user.name);

    await this.ResetPasswordTokenRepository.revokeResetPasswordTokenById(findToken.id);
  }

  private isSafetyPassword(password: string): boolean {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return password.length > 8 && hasUpperCase && hasLowerCase && hasNumber && hasSymbol;
  }
}
