import { ResetPasswordToken } from './reset-password-token.entity';

export abstract class ResetPasswordTokenRepository {
  public abstract createResetPasswordToken(
    token2Fa: ResetPasswordToken,
  ): Promise<ResetPasswordToken>;
  public abstract findValidResetPasswordToken(id: string): Promise<ResetPasswordToken | null>;
  public abstract revokeResetPasswordTokenById(id: string): Promise<boolean>;
}
