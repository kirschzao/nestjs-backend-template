import { Injectable } from '@nestjs/common';
import { LoggerAdapter } from '@/infrastructure/Logger/logger.adapter';
import { UserRepository } from '@/modules/User/domain/user.repository';
import { User } from '@/modules/User/domain/user.entity';

@Injectable()
export class GetAllUsersGqlService {
  constructor(
    private readonly UserRepository: UserRepository,
    private readonly LoggerAdapter: LoggerAdapter,
  ) {}

  async execute(): Promise<User[]> {
    const users = await this.UserRepository.getUsers();

    this.LoggerAdapter.verbose({
      where: 'GetAllUsersGqlService',
      message: `All users fetched via GraphQL: ${users.length} results`,
    });

    return users;
  }
}
