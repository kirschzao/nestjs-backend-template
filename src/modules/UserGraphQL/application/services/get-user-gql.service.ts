import { Injectable } from '@nestjs/common';
import { ExceptionsAdapter } from '@/infrastructure/Exceptions/exceptions.adapter';
import { LoggerAdapter } from '@/infrastructure/Logger/logger.adapter';
import { UserRepository } from '@/modules/User/domain/user.repository';
import { User } from '@/modules/User/domain/user.entity';
import { UserExceptions } from '@/infrastructure/Exceptions/exceptions.types';

@Injectable()
export class GetUserGqlService {
  constructor(
    private readonly UserRepository: UserRepository,
    private readonly ExceptionsAdapter: ExceptionsAdapter,
    private readonly LoggerAdapter: LoggerAdapter,
  ) {}

  async execute(id: string): Promise<User> {
    const user = await this.UserRepository.findUserById(id);
    if (!user) {
      throw this.ExceptionsAdapter.notFound({
        message: 'User not found',
        internalKey: UserExceptions.USER_NOT_FOUND,
      });
    }

    this.LoggerAdapter.verbose({
      where: 'GetUserGqlService',
      message: `User fetched via GraphQL: ${user.id}`,
    });

    return user;
  }
}
