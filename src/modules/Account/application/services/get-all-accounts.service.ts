import { Injectable } from '@nestjs/common';
import { ExceptionsAdapter } from '@/infrastructure/Exceptions/exceptions.adapter';
import { AccountRepository } from '@/modules/Account/domain/account.repository';
import { Account } from '@/modules/Account/domain/account.entity';

@Injectable()
export class GetAllAccountsService {
  constructor(
    private readonly AccountRepository: AccountRepository,
    private readonly ExceptionsAdapter: ExceptionsAdapter,
  ) {}

  async execute(): Promise<Account[]> {
    const accounts = await this.AccountRepository.getAccounts();

    return accounts;
  }
}
