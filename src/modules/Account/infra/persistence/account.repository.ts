import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infrastructure/Database/prisma.service';
import { AccountRepository } from '@/modules/Account/domain/account.repository';
import { Account } from '@/modules/Account/domain/account.entity';
import { AccountMapper } from '@/modules/Account/infra/persistence/account.mapper';
import { AccountTier } from '@/modules/Account/domain/account.entity';
import { AccountStatus } from '@/modules/Account/domain/account.entity';

@Injectable()
export class PrismaAccountRepository implements AccountRepository {
  constructor(private readonly prisma: PrismaService) {}

  public async createAccount(account: Account): Promise<Account> {
    const data = AccountMapper.toPersistence(account);
    const createdAccount = await this.prisma.account.create({
      data: data,
    });
    return AccountMapper.toDomain(createdAccount);
  }

  public async getAccountById(id: string): Promise<Account | null> {
    const account = await this.prisma.account.findUnique({
      where: { id },
    });

    if (!account) {
      return null;
    }
    return AccountMapper.toDomain(account);
  }

  public async getAccounts(): Promise<Account[]> {
    const accounts = await this.prisma.account.findMany();
    return accounts.map((account) => AccountMapper.toDomain(account));
  }

  public async updateAccountTier(accountId: string, tier: AccountTier): Promise<void> {
    await this.prisma.account.update({
      where: { id: accountId },
      data: {
        tier: tier,
      },
    });
  }

  public async updateAccountStatus(accountId: string, status: AccountStatus): Promise<void> {
    await this.prisma.account.update({
      where: { id: accountId },
      data: {
        status: status,
      },
    });
  }

  public async getActivateAccounts(): Promise<Account[]> {
    const accounts = await this.prisma.account.findMany({
      where: {
        status: 'ACTIVE',
      },
    });
    return accounts.map((account) => AccountMapper.toDomain(account));
  }

  public async deleteAccount(id: string): Promise<boolean> {
    await this.prisma.account.delete({
      where: { id },
    });
    return true;
  }
}
