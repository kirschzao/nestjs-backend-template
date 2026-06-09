import { Injectable } from '@nestjs/common';
import { ExceptionsAdapter } from '@/infrastructure/Exceptions/exceptions.adapter';
import { CryptographyAdapter } from '@/infrastructure/Criptography/cryptography.adapter';
import { LoggerAdapter } from '@/infrastructure/Logger/logger.adapter';
import { UserRepository } from '@/modules/User/domain/user.repository';
import { User } from '@/modules/User/domain/user.entity';
import { CreateUserInput } from '@/modules/UserGraphQL/application/dtos/create-user.input';
import { UserExceptions } from '@/infrastructure/Exceptions/exceptions.types';

@Injectable()
export class CreateUserGqlService {
  constructor(
    private readonly UserRepository: UserRepository,
    private readonly ExceptionsAdapter: ExceptionsAdapter,
    private readonly CryptographyAdapter: CryptographyAdapter,
    private readonly LoggerAdapter: LoggerAdapter,
  ) {}

  async execute(input: CreateUserInput): Promise<User> {
    const existingUser = await this.UserRepository.findUserByEmail(input.email);
    if (existingUser) {
      throw this.ExceptionsAdapter.badRequest({
        message: 'This email is already in use',
        internalKey: UserExceptions.USER_EMAIL_ALREADY_IN_USE,
      });
    }

    const hashedPassword = await this.CryptographyAdapter.hash({
      plainText: input.password,
      hashSalt: 8,
    });

    const user = new User({
      name: input.name,
      email: input.email,
      password: hashedPassword,
      cpf: input.cpf,
      phone: input.phone,
      role: input.role,
    });

    const createdUser = await this.UserRepository.createUser(user);

    this.LoggerAdapter.log({
      where: 'CreateUserGqlService',
      message: `User created via GraphQL: ${createdUser.id} | ${createdUser.email}`,
    });

    return createdUser;
  }
}
