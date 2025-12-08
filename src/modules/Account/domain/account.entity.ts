export type AccountStatus = 'ACTIVE' | 'EXPIRED' | 'INACTIVE' | 'REVOKED';
export type AccountTier = 'FREE' | 'PAYMENT';

export interface AccountInterface {
  status: AccountStatus;
  accountTier?: AccountTier;
}

export class Account {
  id: string;
  status: AccountStatus;
  accountTier: AccountTier;

  constructor(account: AccountInterface, id: string) {
    this.id = id;
    this.status = account.status;
    this.accountTier = account.accountTier ?? 'FREE';
  }

  public toJSON() {
    return {
      id: this.id,
      status: this.status,
      accountTier: this.accountTier,
    };
  }
}
