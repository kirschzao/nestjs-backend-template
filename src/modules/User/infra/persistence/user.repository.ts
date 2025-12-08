import { Injectable } from '@nestjs/common';
import { User } from '@/modules/User/domain/user.entity';
import { UserMapper } from '@/modules/User/infra/persistence/user.mapper';
import { UserRepository } from '@/modules/User/domain/user.repository';
import { PrismaService } from '@/infrastructure/Database/prisma.service';
import { UserWithAccountInformationsResponse } from '@/modules/User/domain/user.repository';
import { RoleEnum } from '@/modules/User/domain/user.entity';
import { LoggerAdapter } from '@/infrastructure/Logger/logger.adapter';
import { ExceptionsAdapter } from '@/infrastructure/Exceptions/exceptions.adapter';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly LoggerAdapter: LoggerAdapter,
    private readonly ExceptionsAdapter: ExceptionsAdapter,
  ) {}

  public async createUser(user: User): Promise<User> {
    try {
      const userToPersiste = UserMapper.toPersistence(user);

      const createdUser = await this.prisma.user.create({
        data: {
          ...userToPersiste,
          account: {
            create: {
              status: 'ACTIVE',
              tier: 'FREE',
            },
          },
        },
        include: {
          account: true,
        },
      });

      if (createdUser) {
        this.LoggerAdapter.log({
          where: 'UserRepository.CreateUser',
          message: `New user in database: ${JSON.stringify(createdUser)}`,
        });

        return UserMapper.toDomain(createdUser);
      } else {
        throw this.ExceptionsAdapter.internalServerError({
          message: `[user.repository].createUser --> User was not created in database under email: ${user.email}`,
        });
      }
    } catch (error) {
      throw this.ExceptionsAdapter.internalServerError({
        message: `[user.repository].createUser --> User was not created in database under email: ${user.email} | errorText: ${error}`,
      });
    }
  }

  public async getUser(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return null;
    }

    return UserMapper.toDomain(user);
  }

  public async getUsers(): Promise<User[]> {
    const users = await this.prisma.user.findMany();
    return users.map((user) => UserMapper.toDomain(user));
  }

  public async getUserAccount(id: string): Promise<UserWithAccountInformationsResponse | null> {
    const userWithAccount = await this.prisma.user.findUnique({
      where: { id },
      include: {
        account: true,
      },
    });

    if (!userWithAccount || !userWithAccount.account) {
      return null;
    }

    const account = userWithAccount.account;

    return {
      name: userWithAccount.name,
      email: userWithAccount.email,
      cpf: userWithAccount.cpf,
      phone: userWithAccount.phone,
      createdAt: userWithAccount.createdAt,
      role: userWithAccount.role as RoleEnum,
      accountStatus: account.status,
      accountTier: account.tier,
    };
  }

  public async updateUser(user: User): Promise<User> {
    const data = UserMapper.toPersistence(user);
    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: data,
    });

    return UserMapper.toDomain(updatedUser);
  }

  public async deleteUser(id: string): Promise<boolean> {
    try {
      await this.prisma.user.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      this.LoggerAdapter.error({
        where: 'PrismaUserRepository',
        message: `Error deleting user with ID: ${id}. Error: ${error}`,
      });
      return false;
    }
  }

  public async deleteUserPhone(userId: string): Promise<boolean> {
    try {
      await this.prisma.user.update({
        where: { id: userId },
        data: { phone: null },
      });
      return true;
    } catch (error) {
      this.LoggerAdapter.error({
        where: 'PrismaUserRepository',
        message: `Error deleting phone for user with ID: ${userId}. Error: ${error}`,
      });
      return false;
    }
  }

  public async findUserById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    return user ? UserMapper.toDomain(user) : null;
  }

  public async findUserByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    return user ? UserMapper.toDomain(user) : null;
  }

  public async findUserByCpf(cpf: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { cpf },
    });
    return user ? UserMapper.toDomain(user) : null;
  }

  public async findUserByPhone(phone: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { phone },
    });
    return user ? UserMapper.toDomain(user) : null;
  }
}
