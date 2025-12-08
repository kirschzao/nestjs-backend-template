import { Injectable } from '@nestjs/common';
import { RefreshTokenRepository } from '@/modules/Auth/login/domain/refresh-token.repository';

@Injectable()
export class LogoutService {
  constructor(private readonly refreshTokenRepository: RefreshTokenRepository) {}

  async execute(userId: string): Promise<void> {
    await this.refreshTokenRepository.revokeAllRefreshTokensByAccountId(userId);
  }
}
