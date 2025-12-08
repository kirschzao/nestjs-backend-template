import { Injectable } from '@nestjs/common';
import { ExceptionsAdapter } from '@/infrastructure/Exceptions/exceptions.adapter';
import { ValidateSignupDTO } from '@/modules/Auth/signup/application/dtos/validate.dto';
import { UserRepository } from '@/modules/User/domain/user.repository';
import { Token2FARepository } from '@/modules/Auth/signup/domain/2fa-token.repository';
import { User, RoleEnum } from '@/modules/User/domain/user.entity';
import { SendEmailAdapter } from '@/infrastructure/SendEmail/sendEmail.adapter';
import { TokenExceptions, UserExceptions } from '@/infrastructure/Exceptions/exceptions.types';

@Injectable()
export class ValidateSignupService {
  constructor(
    private readonly ExceptionsAdapter: ExceptionsAdapter,
    private readonly UserRepository: UserRepository,
    private readonly Token2FARepository: Token2FARepository,
    private readonly SendEmailAdapter: SendEmailAdapter,
  ) {}

  async execute(validateSignupDTO: ValidateSignupDTO): Promise<User> {
    const findToken2Fa = await this.Token2FARepository.findValidToken2FA(validateSignupDTO.tokenId);

    if (!findToken2Fa) {
      throw this.ExceptionsAdapter.badRequest({
        message: 'Invalid or expired token',
        internalKey: TokenExceptions.TOKEN_INVALID,
      });
    }

    if (findToken2Fa.isRevoked) {
      throw this.ExceptionsAdapter.badRequest({
        message: 'This token has already been used',
        internalKey: TokenExceptions.TOKEN_INVALID,
      });
    }

    if (findToken2Fa.expiresAt < new Date()) {
      await this.Token2FARepository.revokeRefreshTokenById(findToken2Fa.id);

      throw this.ExceptionsAdapter.badRequest({
        message: 'This token has expired',
        internalKey: TokenExceptions.TOKEN_EXPIRED,
      });
    }

    if (findToken2Fa.token !== validateSignupDTO.token) {
      throw this.ExceptionsAdapter.badRequest({
        message: 'Invalid token',
        internalKey: TokenExceptions.TOKEN_INVALID,
      });
    }

    const user = await this.UserRepository.createUser(
      new User({
        name: findToken2Fa.userInfo2Fa.name ?? '',
        email: findToken2Fa.userInfo2Fa.email,
        password: findToken2Fa.userInfo2Fa.password ?? '',
        role: RoleEnum.USER,
      }),
    );

    if (user) {
      await this.SendEmailAdapter.sendEmailWelcome(user.email, user.name);
      await this.Token2FARepository.revokeRefreshTokenById(findToken2Fa.id);
    } else {
      throw this.ExceptionsAdapter.internalServerError({
        message: 'user not created',
        internalKey: UserExceptions.USER_NOT_CREATED,
      });
    }

    return user;
  }
}
