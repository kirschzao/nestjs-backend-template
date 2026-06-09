import { Injectable } from '@nestjs/common';
import { ExceptionsAdapter } from '@/infrastructure/Exceptions/exceptions.adapter';
import { LoggerAdapter } from '@/infrastructure/Logger/logger.adapter';
import { UserRepository } from '@/modules/User/domain/user.repository';
import { UserExceptions } from '@/infrastructure/Exceptions/exceptions.types';

@Injectable()
export class DeleteUserGqlService {
  constructor(
    private readonly UserRepository: UserRepository,
    private readonly ExceptionsAdapter: ExceptionsAdapter,
    private readonly LoggerAdapter: LoggerAdapter,
  ) {}

  async execute(id: string, authenticatedUserId: string): Promise<boolean> {
    if (id !== authenticatedUserId) {
      throw this.ExceptionsAdapter.forbidden({
        message: 'You can only delete your own account',
        internalKey: UserExceptions.USER_NOT_ALLOWED,
      });
    }

    const user = await this.UserRepository.findUserById(id);
    if (!user) {
      throw this.ExceptionsAdapter.notFound({
        message: 'User not found',
        internalKey: UserExceptions.USER_NOT_FOUND,
      });
    }

    const deleted = await this.UserRepository.deleteUser(id);

    this.LoggerAdapter.log({
      where: 'DeleteUserGqlService',
      message: `User deleted via GraphQL: ${id}`,
    });

    return deleted;
  }
}
