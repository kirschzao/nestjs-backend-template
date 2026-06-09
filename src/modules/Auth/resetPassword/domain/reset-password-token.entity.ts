import { createId } from '@paralleldrive/cuid2';

export interface ResetPasswordTokenInterface {
  token: string;
  createdAt: Date;
  expiresAt: Date;
  isRevoked: boolean;
  attempts?: number;
  userId: string;
}

export class ResetPasswordToken {
  id: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
  isRevoked: boolean;
  attempts: number;
  userId: string;

  constructor(resetPasswordToken: ResetPasswordTokenInterface, id?: string) {
    this.id = id ?? createId();
    this.token = resetPasswordToken.token;
    this.expiresAt = resetPasswordToken.expiresAt;
    this.createdAt = resetPasswordToken.createdAt;
    this.isRevoked = resetPasswordToken.isRevoked;
    this.attempts = resetPasswordToken.attempts ?? 0;
    this.userId = resetPasswordToken.userId;
  }

  public toJSON() {
    return {
      id: this.id,
      expiresAt: this.expiresAt,
      isRevoked: this.isRevoked,
    };
  }
}
