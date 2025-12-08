import { Token2Fa } from './2fa-token.entity';

export abstract class Token2FARepository {
  public abstract createToken2FA(token2Fa: Token2Fa): Promise<Token2Fa>;
  public abstract findValidToken2FA(id: string): Promise<Token2Fa | null>;
  public abstract revokeRefreshTokenById(id: string): Promise<boolean>;
}
