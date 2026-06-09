import { Injectable } from '@nestjs/common';
import { SecretsAdapter } from '@/infrastructure/Secrets/secrets.adapter';
import { CreateSecretParams, UpdateSecretParams } from '@/infrastructure/Secrets/secrets.types';
import { GetSecretService } from './get-secret.service';
import { CreateSecretService } from './create-secret.service';
import { UpdateSecretService } from './update-secret.service';
import { DeleteSecretService } from './delete-secret.service';

@Injectable()
export class SecretsService implements SecretsAdapter {
  constructor(
    private readonly GetSecretService: GetSecretService,
    private readonly CreateSecretService: CreateSecretService,
    private readonly UpdateSecretService: UpdateSecretService,
    private readonly DeleteSecretService: DeleteSecretService,
  ) {}

  async getSecret(secretId: string): Promise<string | undefined> {
    return this.GetSecretService.execute(secretId);
  }

  async getSecretJSON<T = unknown>(secretId: string): Promise<T | undefined> {
    return this.GetSecretService.executeJSON<T>(secretId);
  }

  async createSecret(params: CreateSecretParams): Promise<string | undefined> {
    return this.CreateSecretService.execute(params);
  }

  async updateSecret(params: UpdateSecretParams): Promise<void> {
    return this.UpdateSecretService.execute(params);
  }

  async deleteSecret(secretId: string): Promise<void> {
    return this.DeleteSecretService.execute(secretId);
  }
}
