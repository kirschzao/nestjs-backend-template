import { Injectable } from '@nestjs/common';
import { ExceptionsAdapter } from '@/infrastructure/Exceptions/exceptions.adapter';
import { LoggerAdapter } from '@/infrastructure/Logger/logger.adapter';
import { UserRepository } from '@/modules/User/domain/user.repository';
import { User } from '@/modules/User/domain/user.entity';
import { UpdateUserInput } from '@/modules/UserGraphQL/application/dtos/update-user.input';
import { UserExceptions } from '@/infrastructure/Exceptions/exceptions.types';

@Injectable()
export class UpdateUserGqlService {
  constructor(
    private readonly UserRepository: UserRepository,
    private readonly ExceptionsAdapter: ExceptionsAdapter,
    private readonly LoggerAdapter: LoggerAdapter,
  ) {}

  async execute(id: string, input: UpdateUserInput, authenticatedUserId: string): Promise<User> {
    if (id !== authenticatedUserId) {
      throw this.ExceptionsAdapter.forbidden({
        message: 'You can only update your own profile',
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

    if (input.name !== undefined) user.name = input.name;
    if (input.cpf !== undefined) user.cpf = input.cpf;
    if (input.phone !== undefined) user.phone = input.phone;
    if (input.role !== undefined) user.role = input.role;

    const updatedUser = await this.UserRepository.updateUser(user);

    this.LoggerAdapter.log({
      where: 'UpdateUserGqlService',
      message: `User updated via GraphQL: ${updatedUser.id}`,
    });

    return updatedUser;
  }
}
