import { Injectable } from '@nestjs/common';
import { Account, AccountStatus } from '@/modules/Account/domain/account.entity';
import { Account as PrismaAccount } from '@prisma/client';

@Injectable()
export class AccountMapper {
  static toDomain(account: PrismaAccount): Account {
    return new Account(
      {
        status: account.status as AccountStatus,
        accountTier: account.tier,
      },
      account.id,
    );
  }

  static toPersistence(account: Account): PrismaAccount {
    return {
      id: account.id,
      status: account.status,
      tier: account.accountTier,
    };
  }
}
