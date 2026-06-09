import { Injectable } from '@nestjs/common';
import { GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';
import { ConfigService } from '@nestjs/config';
import { ExceptionsAdapter } from '@/infrastructure/Exceptions/exceptions.adapter';
import { LoggerAdapter } from '@/infrastructure/Logger/logger.adapter';
import { SecretsHelperIntegration } from './secrets-helper-integration';
import { SecretsExceptions } from '@/infrastructure/Exceptions/exceptions.types';

@Injectable()
export class GetSecretService extends SecretsHelperIntegration {
  constructor(
    readonly ConfigService: ConfigService,
    readonly ExceptionsAdapter: ExceptionsAdapter,
    private readonly LoggerAdapter: LoggerAdapter,
  ) {
    super(ConfigService, ExceptionsAdapter);
  }

  async execute(secretId: string): Promise<string | undefined> {
    const command = new GetSecretValueCommand({ SecretId: secretId });

    try {
      const result = await this.secretsClient.send(command);
      return result.SecretString;
    } catch (error) {
      this.LoggerAdapter.error({
        where: 'GetSecretService',
        message: `Error fetching secret ${secretId}: ${error instanceof Error ? error.message : error}`,
      });
      throw this.ExceptionsAdapter.internalServerError({
        message: 'Failed to retrieve secret',
        internalKey: SecretsExceptions.SECRET_NOT_FOUND,
      });
    }
  }

  async executeJSON<T = unknown>(secretId: string): Promise<T | undefined> {
    const secret = await this.execute(secretId);
    if (!secret) return undefined;

    try {
      return JSON.parse(secret) as T;
    } catch {
      return undefined;
    }
  }
}
