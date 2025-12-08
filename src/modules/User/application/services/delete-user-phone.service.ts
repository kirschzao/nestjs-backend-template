import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../domain/user.repository';
import { ExceptionsAdapter } from '@/infrastructure/Exceptions/exceptions.adapter';
import { UserExceptions } from '@/infrastructure/Exceptions/exceptions.types';
import { LoggerAdapter } from '@/infrastructure/Logger/logger.adapter';

@Injectable()
export class DeleteUserPhoneService {
  constructor(
    private readonly UserRepository: UserRepository,
    private readonly ExceptionsAdapter: ExceptionsAdapter,
    private readonly LoggerAdapter: LoggerAdapter,
  ) {}

  async execute(userId: string): Promise<void> {
    this.LoggerAdapter.log({
      message: `Starting phone deletion for user with id: ${userId}`,
      where: 'DeleteUserPhoneService',
    });
    const user = await this.UserRepository.findUserById(userId);

    if (!user) {
      throw this.ExceptionsAdapter.notFound({
        message: 'User not found with the provided ID',
        internalKey: UserExceptions.USER_NOT_FOUND,
      });
    }

    this.LoggerAdapter.log({
      message: `Deleting phone for user with id: ${userId}`,
      where: 'DeleteUserPhoneService',
    });
    await this.UserRepository.deleteUserPhone(userId);
  }
}
