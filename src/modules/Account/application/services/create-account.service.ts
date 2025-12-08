import { Injectable } from '@nestjs/common';
import { ExceptionsAdapter } from '@/infrastructure/Exceptions/exceptions.adapter';
import { AccountRepository } from '@/modules/Account/domain/account.repository';
import { Account } from '@/modules/Account/domain/account.entity';
import { CreateAccountDTO } from '../dtos/create-account.dto';

@Injectable()
export class CreateAccountService {
  constructor(
    private readonly AccountRepository: AccountRepository,
    private readonly ExceptionsAdapter: ExceptionsAdapter,
  ) {}

  async execute(account: CreateAccountDTO, userId: string): Promise<Account> {
    const findAccount = await this.AccountRepository.getAccountById(userId);
    if (findAccount) {
      throw this.ExceptionsAdapter.conflict({
        message: 'Account with this ID already exists',
      });
    }

    const newAccount = new Account(account, userId);
    return await this.AccountRepository.createAccount(newAccount);
  }
}
