import { Injectable } from '@nestjs/common';
import { ExceptionsAdapter } from '@/infrastructure/Exceptions/exceptions.adapter';
import { CryptographyAdapter } from '@/infrastructure/Criptography/cryptography.adapter';
import { SignupRequestDTO } from '@/modules/Auth/signup/application/dtos/signup.dto';
import { UserRepository } from '@/modules/User/domain/user.repository';
import { Token2FARepository } from '@/modules/Auth/signup/domain/2fa-token.repository';
import { Token2Fa } from '@/modules/Auth/signup/domain/2fa-token.entity';
import { SendEmailAdapter } from '@/infrastructure/SendEmail/sendEmail.adapter';
import { UserExceptions } from '@/infrastructure/Exceptions/exceptions.types';

@Injectable()
export class SignupService {
  constructor(
    private readonly ExceptionsAdapter: ExceptionsAdapter,
    private readonly CryptographyAdapter: CryptographyAdapter,
    private readonly UserRepository: UserRepository,
    private readonly Token2FARepository: Token2FARepository,
    private readonly SendEmailAdapter: SendEmailAdapter,
  ) {}

  async execute(signupRequest: SignupRequestDTO): Promise<Token2Fa> {
    const findUserEmail = await this.UserRepository.findUserByEmail(signupRequest.email);
    if (findUserEmail) {
      throw this.ExceptionsAdapter.badRequest({
        message: 'This email is already in use',
        internalKey: UserExceptions.USER_EMAIL_ALREADY_IN_USE,
      });
    }

    if (!this.isSafetyPassword(signupRequest.password)) {
      throw this.ExceptionsAdapter.badRequest({
        message: 'Your password is not strong enough',
        internalKey: UserExceptions.USER_NOT_SAFETY_PASSWORD,
      });
    }

    const hashedPassword = await this.CryptographyAdapter.hash({
      plainText: signupRequest.password,
      hashSalt: 8,
    });

    const generateToken2Fa = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, '0');
    const newToken2Fa = new Token2Fa(
      {
        token: generateToken2Fa,
        expiresAt: new Date(new Date().getTime() + 10 * 60000),
        createdAt: new Date(),
        isRevoked: false,
      },
      { name: signupRequest.name, email: signupRequest.email, password: hashedPassword },
    );

    const token = await this.Token2FARepository.createToken2FA(newToken2Fa);

    await this.SendEmailAdapter.sendEmail2FA(
      signupRequest.email,
      generateToken2Fa,
      signupRequest.name,
    );

    return token;
  }

  private isSafetyPassword(password: string): boolean {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return password.length > 8 && hasUpperCase && hasLowerCase && hasNumber && hasSymbol;
  }
}
