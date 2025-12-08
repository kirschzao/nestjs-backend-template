import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../domain/user.repository';
import { ExceptionsAdapter } from '@/infrastructure/Exceptions/exceptions.adapter';
import { UserExceptions } from '@/infrastructure/Exceptions/exceptions.types';
import { CryptographyAdapter } from '@/infrastructure/Criptography/cryptography.adapter';
import { LoggerAdapter } from '@/infrastructure/Logger/logger.adapter';

@Injectable()
export class DeleteUserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly exceptionsAdapter: ExceptionsAdapter,
    private readonly cryptographyAdapter: CryptographyAdapter,
    private readonly LoggerAdapter: LoggerAdapter,
  ) {}

  async execute(id: string, userId: string, password: string): Promise<boolean> {
    if (id !== userId) {
      throw this.exceptionsAdapter.forbidden({
        message: "User doesn't have permission",
        internalKey: UserExceptions.USER_NOT_ALLOWED,
      });
    }
    const user = await this.userRepository.findUserById(id);

    if (!user) {
      throw this.exceptionsAdapter.notFound({
        message: 'User not found with the provided ID',
        internalKey: UserExceptions.USER_NOT_FOUND,
      });
    }

    const isPasswordValid = await this.cryptographyAdapter.compare({
      plainText: password,
      cryptographedText: user.password,
    });

    if (!isPasswordValid) {
      throw this.exceptionsAdapter.unauthorized({
        message: 'Invalid password provided',
        internalKey: UserExceptions.USER_INVALID_PASSWORD,
      });
    }
    this.LoggerAdapter.log({
      message: `Deleting user with id: ${id}`,
      where: 'DeleteUserService',
    });
    return await this.userRepository.deleteUser(id);
  }
}
