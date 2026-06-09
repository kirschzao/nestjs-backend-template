import { Injectable } from '@nestjs/common';
import { PutSecretValueCommand } from '@aws-sdk/client-secrets-manager';
import { ConfigService } from '@nestjs/config';
import { ExceptionsAdapter } from '@/infrastructure/Exceptions/exceptions.adapter';
import { LoggerAdapter } from '@/infrastructure/Logger/logger.adapter';
import { SecretsHelperIntegration } from './secrets-helper-integration';
import { UpdateSecretParams } from '@/infrastructure/Secrets/secrets.types';
import { SecretsExceptions } from '@/infrastructure/Exceptions/exceptions.types';

@Injectable()
export class UpdateSecretService extends SecretsHelperIntegration {
  constructor(
    readonly ConfigService: ConfigService,
    readonly ExceptionsAdapter: ExceptionsAdapter,
    private readonly LoggerAdapter: LoggerAdapter,
  ) {
    super(ConfigService, ExceptionsAdapter);
  }

  async execute(params: UpdateSecretParams): Promise<void> {
    const command = new PutSecretValueCommand({
      SecretId: params.secretId,
      SecretString: params.value,
    });

    try {
      await this.secretsClient.send(command);
      this.LoggerAdapter.log({
        where: 'UpdateSecretService',
        message: `Secret updated: ${params.secretId}`,
      });
    } catch (error) {
      this.LoggerAdapter.error({
        where: 'UpdateSecretService',
        message: `Error updating secret ${params.secretId}: ${error instanceof Error ? error.message : error}`,
      });
      throw this.ExceptionsAdapter.internalServerError({
        message: 'Failed to update secret',
        internalKey: SecretsExceptions.SECRET_UPDATE_FAILED,
      });
    }
  }
}
