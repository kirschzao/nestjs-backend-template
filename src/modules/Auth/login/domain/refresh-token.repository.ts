import { RefreshToken } from './refresh-token.entity';

export abstract class RefreshTokenRepository {
  public abstract createRefreshToken(refreshToken: RefreshToken): Promise<void>;
  public abstract findValidRefreshTokenByAccountId(userId: string): Promise<RefreshToken | null>;
  public abstract revokeAllRefreshTokensByAccountId(userId: string): Promise<void>;
  public abstract revokeRefreshTokenById(id: string): Promise<void>;
}
