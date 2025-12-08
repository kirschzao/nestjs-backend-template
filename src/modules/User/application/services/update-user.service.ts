import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../domain/user.repository';
import { User } from '@/modules/User/domain/user.entity';
import { UpdateUserDTO } from '@/modules/User/application/dtos/update-user.dto';
import { ExceptionsAdapter } from '@/infrastructure/Exceptions/exceptions.adapter';
import { UserExceptions } from '@/infrastructure/Exceptions/exceptions.types';
@Injectable()
export class UpdateUserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly exceptionsAdapter: ExceptionsAdapter,
  ) {}

  async execute(id: string, updatedUser: UpdateUserDTO): Promise<User> {
    const { name, cpf, phone, role } = updatedUser;

    const existingUser = await this.userRepository.findUserById(id);
    if (!existingUser) {
      throw this.exceptionsAdapter.notFound({
        message: 'User not found with the provided ID',
        internalKey: UserExceptions.USER_NOT_FOUND,
      });
    }

    if (cpf) {
      const verifyCpf = await this.userRepository.findUserByCpf(cpf);
      if (verifyCpf) {
        throw this.exceptionsAdapter.badRequest({
          message: 'This cpf is already in use',
          internalKey: UserExceptions.USER_CPF_ALREADY_IN_USE,
        });
      }
    }

    if (phone) {
      const verifyPhone = await this.userRepository.findUserByPhone(phone);
      if (verifyPhone) {
        throw this.exceptionsAdapter.badRequest({
          message: 'This phone is already in use',
          internalKey: UserExceptions.USER_PHONE_ALREADY_IN_USE,
        });
      }
    }

    existingUser.name = name ?? existingUser.name;
    existingUser.cpf = cpf ?? existingUser.cpf;
    existingUser.phone = phone ?? existingUser.phone;
    existingUser.role = role ?? existingUser.role;

    return await this.userRepository.updateUser(existingUser);
  }
}
