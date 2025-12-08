import { User, RoleEnum } from '@/modules/User/domain/user.entity';
import { User as PrismaUser, RoleEnum as PrismaRole } from '@prisma/client';

export class UserMapper {
  static toDomain(user: PrismaUser): User {
    const model = new User(
      {
        name: user.name,
        email: user.email,
        password: user.password,
        cpf: user.cpf,
        phone: user.phone,
        createdAt: user.createdAt,
        role: user.role as RoleEnum,
      },
      user.id,
    );
    return model;
  }

  static toPersistence(user: User): PrismaUser {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      createdAt: user.createdAt,
      cpf: user.cpf,
      phone: user.phone,
      role: user.role as PrismaRole,
    };
  }
}
