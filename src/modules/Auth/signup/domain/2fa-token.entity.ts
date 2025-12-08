import { createId } from '@paralleldrive/cuid2';

export interface Token2FaInterface {
  token: string;
  createdAt: Date;
  expiresAt: Date;
  isRevoked: boolean;
}

export interface UserInfo2Fa {
  name?: string;
  email: string;
  password?: string;
}

export class Token2Fa {
  id: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
  isRevoked: boolean;
  userInfo2Fa: UserInfo2Fa;

  constructor(token2FA: Token2FaInterface, userInfo2Fa: UserInfo2Fa, id?: string) {
    this.id = id ?? createId();
    this.token = token2FA.token;
    this.expiresAt = token2FA.expiresAt;
    this.createdAt = token2FA.createdAt;
    this.isRevoked = token2FA.isRevoked;
    this.userInfo2Fa = userInfo2Fa;
  }

  public toJSON() {
    return {
      id: this.id,
      expiresAt: this.expiresAt,
      isRevoked: this.isRevoked,
    };
  }
}
