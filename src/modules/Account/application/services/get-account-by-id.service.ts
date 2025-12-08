import { Injectable } from '@nestjs/common';
import { ExceptionsAdapter } from '@/infrastructure/Exceptions/exceptions.adapter';
import { AccountRepository } from '@/modules/Account/domain/account.repository';
import { Account } from '@/modules/Account/domain/account.entity';

@Injectable()
export class GetAccountByIdService {
  constructor(
    private readonly AccountRepository: AccountRepository,
    private readonly ExceptionsAdapter: ExceptionsAdapter,
  ) {}

  async execute(accountId: string): Promise<Account> {
    const findAccount = await this.AccountRepository.getAccountById(accountId);

    if (!findAccount) {
      throw this.ExceptionsAdapter.notFound({
        message: 'Account not found',
      });
    }

    return findAccount;
  }
}
