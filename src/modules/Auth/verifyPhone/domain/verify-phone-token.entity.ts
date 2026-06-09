import { createId } from '@paralleldrive/cuid2';

export interface TokenVerifyPhoneInterface {
  userId: string;
  token: string;
  phone: string;
  createdAt: Date;
  expiresAt: Date;
  isRevoked: boolean;
  attempts?: number;
}

export class VerifyPhoneToken {
  id: string;
  token: string;
  userId: string;
  createdAt: Date;
  expiresAt: Date;
  isRevoked: boolean;
  attempts: number;
  phone: string;

  constructor(tokenVerifyPhone: TokenVerifyPhoneInterface, id?: string) {
    this.id = id ?? createId();
    this.userId = tokenVerifyPhone.userId;
    this.token = tokenVerifyPhone.token;
    this.phone = tokenVerifyPhone.phone;
    this.createdAt = tokenVerifyPhone.createdAt;
    this.expiresAt = tokenVerifyPhone.expiresAt;
    this.isRevoked = tokenVerifyPhone.isRevoked;
    this.attempts = tokenVerifyPhone.attempts ?? 0;
  }

  public toJSON() {
    return {
      id: this.id,
      phone: this.phone,
      expiresAt: this.expiresAt,
      isRevoked: this.isRevoked,
    };
  }
}
