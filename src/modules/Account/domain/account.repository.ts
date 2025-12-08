import { Account, AccountTier, AccountStatus } from '@/modules/Account/domain/account.entity';

export abstract class AccountRepository {
  public abstract createAccount(account: Account): Promise<Account>;
  public abstract getAccountById(id: string): Promise<Account | null>;
  public abstract getAccounts(): Promise<Account[]>;
  public abstract getActivateAccounts(): Promise<Account[]>;
  public abstract updateAccountTier(accountId: string, accountTier: AccountTier): Promise<void>;
  public abstract updateAccountStatus(accountId: string, status: AccountStatus): Promise<void>;
  public abstract deleteAccount(id: string): Promise<boolean>;
}
