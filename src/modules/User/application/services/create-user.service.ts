import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../domain/user.repository';
import { User } from '@/modules/User/domain/user.entity';
import { CreateUserDTO } from '@/modules/User/application/dtos/create-user.dto';
import { ExceptionsAdapter } from '@/infrastructure/Exceptions/exceptions.adapter';
import { CryptographyAdapter } from '@/infrastructure/Criptography/cryptography.adapter';
import { UserExceptions } from '@/infrastructure/Exceptions/exceptions.types';

@Injectable()
export class CreateUserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly cryptographyAdapter: CryptographyAdapter,
    private readonly exceptionsAdapter: ExceptionsAdapter,
  ) {}

  async execute(user: CreateUserDTO): Promise<User> {
    const findUserEmail = await this.userRepository.findUserByEmail(user.email);
    if (findUserEmail) {
      throw this.exceptionsAdapter.badRequest({
        message: 'This email is already in use',
        internalKey: UserExceptions.USER_EMAIL_ALREADY_IN_USE,
      });
    }

    if (user.phone) {
      const findUserPhone = await this.userRepository.findUserByPhone(user.phone);
      if (findUserPhone) {
        throw this.exceptionsAdapter.badRequest({
          message: 'This phone is already in use',
          internalKey: UserExceptions.USER_PHONE_ALREADY_IN_USE,
        });
      }
    }

    const hashedPassword = await this.cryptographyAdapter.hash({
      plainText: user.password,
      hashSalt: 8,
    });

    const { name, email, phone, cpf, role } = user;

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      cpf,
      phone,
      role,
    });

    const userCreated = await this.userRepository.createUser(newUser);

    if (!userCreated) {
      throw this.exceptionsAdapter.badRequest({
        message: 'User was not created',
        internalKey: UserExceptions.USER_NOT_CREATED,
      });
    }

    return userCreated;
  }
}
