export type AccountStatus = 'ACTIVE' | 'EXPIRED' | 'INACTIVE' | 'REVOKED';
export type AccountTier = 'FREE' | 'PAYMENT';

export interface AccountInterface {
  signatureStartDate?: Date | null;
  signatureEndDate?: Date | null;
  currentSignatureId: string | null;
  status: AccountStatus;
  tokensUsed?: number;
  meetingSecondsUsed?: number;
  storageUsedInBytes?: number;
  accountTier?: AccountTier;
}

export class Account {
  id: string;
  signatureStartDate: Date | null;
  signatureEndDate: Date | null;
  currentSignatureId: string | null;
  status: AccountStatus;
  tokensUsed: number;
  accountTier: AccountTier;

  constructor(account: AccountInterface, id: string) {
    this.id = id;
    this.signatureStartDate = account.signatureStartDate ?? null;
    this.signatureEndDate = account.signatureEndDate ?? null;
    this.currentSignatureId = account.currentSignatureId ?? null;
    this.status = account.status;
    this.tokensUsed = account.tokensUsed ?? 0;
    this.accountTier = account.accountTier ?? 'FREE';
  }

  public toJSON() {
    return {
      id: this.id,
      signatureStartDate: this.signatureStartDate,
      signatureEndDate: this.signatureEndDate,
      signatureId: this.currentSignatureId,
      status: this.status,
      tokensUsed: this.tokensUsed,
      accountTier: this.accountTier,
    };
  }
}
