import { Injectable } from '@nestjs/common';
import { CreateSecretCommand } from '@aws-sdk/client-secrets-manager';
import { ConfigService } from '@nestjs/config';
import { ExceptionsAdapter } from '@/infrastructure/Exceptions/exceptions.adapter';
import { LoggerAdapter } from '@/infrastructure/Logger/logger.adapter';
import { SecretsHelperIntegration } from './secrets-helper-integration';
import { CreateSecretParams } from '@/infrastructure/Secrets/secrets.types';
import { SecretsExceptions } from '@/infrastructure/Exceptions/exceptions.types';

@Injectable()
export class CreateSecretService extends SecretsHelperIntegration {
  constructor(
    readonly ConfigService: ConfigService,
    readonly ExceptionsAdapter: ExceptionsAdapter,
    private readonly LoggerAdapter: LoggerAdapter,
  ) {
    super(ConfigService, ExceptionsAdapter);
  }

  async execute(params: CreateSecretParams): Promise<string | undefined> {
    const command = new CreateSecretCommand({
      Name: params.name,
      SecretString: params.value,
      Description: params.description,
    });

    try {
      const result = await this.secretsClient.send(command);
      return result.ARN;
    } catch (error) {
      this.LoggerAdapter.error({
        where: 'CreateSecretService',
        message: `Error creating secret ${params.name}: ${error instanceof Error ? error.message : error}`,
      });
      throw this.ExceptionsAdapter.internalServerError({
        message: 'Failed to create secret',
        internalKey: SecretsExceptions.SECRET_CREATE_FAILED,
      });
    }
  }
}
