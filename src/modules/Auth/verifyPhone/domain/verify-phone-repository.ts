import { VerifyPhoneToken } from './verify-phone-token.entity';

export abstract class VerifyPhoneRepository {
  public abstract createTokenVerifyPhone(
    tokenVerifyPhone: VerifyPhoneToken,
  ): Promise<VerifyPhoneToken>;
  public abstract findValidTokenVerifyPhone(id: string): Promise<VerifyPhoneToken | null>;
  public abstract revokeTokenById(id: string): Promise<boolean>;
}
