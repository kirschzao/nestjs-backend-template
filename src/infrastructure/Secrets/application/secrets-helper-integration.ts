import { Injectable } from '@nestjs/common';
import { SecretsManagerClient } from '@aws-sdk/client-secrets-manager';
import { ConfigService } from '@nestjs/config';
import { ExceptionsAdapter } from '@/infrastructure/Exceptions/exceptions.adapter';

@Injectable()
export class SecretsHelperIntegration {
  readonly secretsClient: SecretsManagerClient;

  constructor(
    readonly ConfigService: ConfigService,
    readonly ExceptionsAdapter: ExceptionsAdapter,
  ) {
    const accessKeyId = this.ConfigService.get<string>('SECRETS_ACCESS_KEY_ID');
    const secretAccessKey = this.ConfigService.get<string>('SECRETS_SECRET_ACCESS_KEY');
    const region = this.ConfigService.get<string>('SECRETS_REGION');

    if (!accessKeyId || !secretAccessKey || !region) {
      throw this.ExceptionsAdapter.internalServerError({
        message: 'Secrets Manager environment variables missing',
      });
    }

    this.secretsClient = new SecretsManagerClient({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }
}
