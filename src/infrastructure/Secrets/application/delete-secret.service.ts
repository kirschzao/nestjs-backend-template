import { Injectable } from '@nestjs/common';
import { DeleteSecretCommand } from '@aws-sdk/client-secrets-manager';
import { ConfigService } from '@nestjs/config';
import { ExceptionsAdapter } from '@/infrastructure/Exceptions/exceptions.adapter';
import { LoggerAdapter } from '@/infrastructure/Logger/logger.adapter';
import { SecretsHelperIntegration } from './secrets-helper-integration';
import { SecretsExceptions } from '@/infrastructure/Exceptions/exceptions.types';

@Injectable()
export class DeleteSecretService extends SecretsHelperIntegration {
  constructor(
    readonly ConfigService: ConfigService,
    readonly ExceptionsAdapter: ExceptionsAdapter,
    private readonly LoggerAdapter: LoggerAdapter,
  ) {
    super(ConfigService, ExceptionsAdapter);
  }

  async execute(secretId: string): Promise<void> {
    const command = new DeleteSecretCommand({
      SecretId: secretId,
      ForceDeleteWithoutRecovery: false,
    });

    try {
      await this.secretsClient.send(command);
      this.LoggerAdapter.log({
        where: 'DeleteSecretService',
        message: `Secret deleted: ${secretId}`,
      });
    } catch (error) {
      this.LoggerAdapter.error({
        where: 'DeleteSecretService',
        message: `Error deleting secret ${secretId}: ${error instanceof Error ? error.message : error}`,
      });
      throw this.ExceptionsAdapter.internalServerError({
        message: 'Failed to delete secret',
        internalKey: SecretsExceptions.SECRET_DELETE_FAILED,
      });
    }
  }
}
