import { Injectable } from '@nestjs/common';
import { Account, AccountStatus } from '@/modules/Account/domain/account.entity';
import { Account as PrismaAccount } from '@prisma/client';

@Injectable()
export class AccountMapper {
  static toDomain(account: PrismaAccount): Account {
    return new Account(
      {
        signatureStartDate: account.signatureStartDate ?? null,
        signatureEndDate: account.signatureEndDate,
        currentSignatureId: account.currentSignatureId,
        status: account.status as AccountStatus,
        storageUsedInBytes: account.storageUsedInBytes,
        accountTier: account.tier,
      },
      account.id,
    );
  }

  static toPersistence(account: Account): PrismaAccount {
    return {
      id: account.id,
      signatureStartDate: account.signatureStartDate,
      signatureEndDate: account.signatureEndDate,
      currentSignatureId: account.currentSignatureId,
      status: account.status,
      tokensUsed: account.tokensUsed,
      tier: account.accountTier,
    };
  }
}
