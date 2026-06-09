import { Injectable } from '@nestjs/common';
import { LambdaClient } from '@aws-sdk/client-lambda';
import { ConfigService } from '@nestjs/config';
import { ExceptionsAdapter } from '@/infrastructure/Exceptions/exceptions.adapter';

@Injectable()
export class LambdaHelperIntegration {
  readonly lambdaClient: LambdaClient;

  constructor(
    readonly ConfigService: ConfigService,
    readonly ExceptionsAdapter: ExceptionsAdapter,
  ) {
    const accessKeyId = this.ConfigService.get<string>('LAMBDA_ACCESS_KEY_ID');
    const secretAccessKey = this.ConfigService.get<string>('LAMBDA_SECRET_ACCESS_KEY');
    const region = this.ConfigService.get<string>('LAMBDA_REGION');

    if (!accessKeyId || !secretAccessKey || !region) {
      throw this.ExceptionsAdapter.internalServerError({
        message: 'Lambda environment variables missing',
      });
    }

    this.lambdaClient = new LambdaClient({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }
}
