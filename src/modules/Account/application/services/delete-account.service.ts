import { Injectable } from '@nestjs/common';
import { ExceptionsAdapter } from '@/infrastructure/Exceptions/exceptions.adapter';
import { AccountRepository } from '@/modules/Account/domain/account.repository';

@Injectable()
export class DeleteAccountService {
  constructor(
    private readonly AccountRepository: AccountRepository,
    private readonly ExceptionsAdapter: ExceptionsAdapter,
  ) {}

  async execute(accountId: string): Promise<void> {
    const findAccount = await this.AccountRepository.getAccountById(accountId);

    if (!findAccount) {
      throw this.ExceptionsAdapter.notFound({
        message: 'Account not found',
      });
    }

    return await this.AccountRepository.updateAccountStatus(accountId, 'INACTIVE');
  }
}
