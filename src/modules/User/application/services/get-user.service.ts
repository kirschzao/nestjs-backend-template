import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../domain/user.repository';
import { User } from '@/modules/User/domain/user.entity';
import { ExceptionsAdapter } from '@/infrastructure/Exceptions/exceptions.adapter';
import { CryptographyAdapter } from '@/infrastructure/Criptography/cryptography.adapter';
import { UserExceptions } from '@/infrastructure/Exceptions/exceptions.types';

@Injectable()
export class GetUserByIdService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly cryptographyAdapter: CryptographyAdapter,
    private readonly exceptionsAdapter: ExceptionsAdapter,
  ) {}

  async execute(id: string): Promise<User> {
    const user = await this.userRepository.getUser(id);
    if (!user) {
      throw this.exceptionsAdapter.notFound({
        message: 'User not found with the provided ID',
        internalKey: UserExceptions.USER_NOT_FOUND,
      });
    }
    return user;
  }
}
