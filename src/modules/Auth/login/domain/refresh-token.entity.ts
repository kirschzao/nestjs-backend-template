import { createId } from '@paralleldrive/cuid2';

export interface RefreshTokenInterface {
  token: string;
  accountId: string;
  expiresAt: Date;
  createdAt: Date;
  isRevoked: boolean;
}

export class RefreshToken {
  id: string;
  token: string;
  accountId: string;
  expiresAt: Date;
  createdAt: Date;
  isRevoked: boolean;

  constructor(refreshToken: RefreshTokenInterface, id?: string) {
    this.id = id ?? createId();
    this.token = refreshToken.token;
    this.accountId = refreshToken.accountId;
    this.expiresAt = refreshToken.expiresAt;
    this.createdAt = refreshToken.createdAt;
    this.isRevoked = refreshToken.isRevoked;
  }

  public toJSON() {
    return {
      token: this.token,
      userId: this.accountId,
      expiresAt: this.expiresAt,
      createdAt: this.createdAt,
      isRevoked: this.isRevoked,
    };
  }
}
