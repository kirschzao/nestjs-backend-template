import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infrastructure/Database/prisma.service';
import { AccountRepository } from '@/modules/Account/domain/account.repository';
import { Account } from '@/modules/Account/domain/account.entity';
import { AccountMapper } from '@/modules/Account/infra/persistence/account.mapper';
import { AccountTier } from '@/modules/Account/domain/account.entity';
import { AccountStatus } from '@/modules/Account/domain/account.entity';
import { AccountSignatureResponse } from '@/modules/Account/domain/account.repository';

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

  public async addTokensUsed(accountId: string, tokens: number): Promise<void> {
    await this.prisma.account.update({
      where: { id: accountId },
      data: {
        tokensUsed: {
          increment: tokens,
        },
      },
    });
  }

  public async addMeetingSecondsUsed(accountId: string, seconds: number): Promise<void> {
    await this.prisma.account.update({
      where: { id: accountId },
      data: {
        meetingSecondsUsed: {
          increment: seconds,
        },
      },
    });
  }

  public async updateStorageUsedInBytes(accountId: string, bytes: number): Promise<void> {
    await this.prisma.account.update({
      where: { id: accountId },
      data: {
        storageUsedInBytes: {
          increment: bytes,
        },
      },
    });
  }

  public async updateAccountSignature(account: Account): Promise<Account> {
    const data = AccountMapper.toPersistence(account);
    const updatedAccount = await this.prisma.account.update({
      where: { id: account.id },
      data: data,
    });
    return AccountMapper.toDomain(updatedAccount);
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

  public async getAccountCurrentSignature(
    accountId: string,
  ): Promise<AccountSignatureResponse | null> {
    const account = await this.prisma.account.findUnique({
      where: { id: accountId },
    });

    if (!account) {
      return null;
    }

    const signature = await this.prisma.signature.findUnique({
      where: { id: account.currentSignatureId || '' },
    });

    if (!signature) {
      return null;
    }

    const product = await this.prisma.product.findUnique({
      where: { id: signature.id },
    });

    if (!product) {
      return null;
    }

    return {
      name: product.name,
      price: product.price,
      duration: signature.duration,
      deprecatedAt: account.signatureEndDate,
      signatureStartDate: account.signatureStartDate,
    };
  }

  public async deleteAccount(id: string): Promise<boolean> {
    await this.prisma.account.delete({
      where: { id },
    });
    return true;
  }
}
