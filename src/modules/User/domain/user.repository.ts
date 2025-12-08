import { Injectable } from '@nestjs/common';
import { User } from '@/modules/User/domain/user.entity';
import { RoleEnum } from './user.entity';

@Injectable()
export abstract class UserRepository {
  public abstract createUser(user: User): Promise<User>;
  public abstract getUser(id: string): Promise<User | null>;
  public abstract getUserAccount(id: string): Promise<UserWithAccountInformationsResponse | null>;
  public abstract getUsers(): Promise<User[]>;
  public abstract updateUser(user: User): Promise<User>;
  public abstract deleteUser(id: string): Promise<boolean>;
  public abstract deleteUserPhone(userId: string): Promise<boolean>;
  public abstract findUserById(id: string): Promise<User | null>;
  public abstract findUserByEmail(email: string): Promise<User | null>;
  public abstract findUserByCpf(cpf: string): Promise<User | null>;
  public abstract findUserByPhone(phone: string): Promise<User | null>;
}

export interface UserWithAccountInformationsResponse {
  name: string;
  email: string;
  cpf: string | null;
  phone: string | null;
  createdAt: Date;
  role: RoleEnum;
  accountStatus: AccountStatus;
  accountTier: AccountTier;
}

export type AccountStatus = 'ACTIVE' | 'EXPIRED' | 'INACTIVE' | 'REVOKED';
export type AccountTier = 'FREE' | 'PAYMENT';
