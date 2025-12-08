import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../domain/user.repository';
import { ExceptionsAdapter } from '@/infrastructure/Exceptions/exceptions.adapter';
import { UserExceptions } from '@/infrastructure/Exceptions/exceptions.types';
import { UserWithAccountInformationsResponse } from '@/modules/User/domain/user.repository';

@Injectable()
export class GetUserWithAccountService {
  constructor(
    private readonly UserRepository: UserRepository,
    private readonly ExceptionsAdapter: ExceptionsAdapter,
  ) {}

  async execute(id: string): Promise<UserWithAccountInformationsResponse | null> {
    const userAccountInfo = await this.UserRepository.getUserAccount(id);
    if (!userAccountInfo) {
      throw this.ExceptionsAdapter.notFound({
        message: 'User account information not found with the provided ID',
        internalKey: UserExceptions.USER_NOT_FOUND,
      });
    }
    return userAccountInfo;
  }
}
