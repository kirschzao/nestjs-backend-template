import { Injectable } from '@nestjs/common';
import { SNSClient } from '@aws-sdk/client-sns';
import { ConfigService } from '@nestjs/config';
import { ExceptionsAdapter } from '@/infrastructure/Exceptions/exceptions.adapter';

@Injectable()
export class SNSHelperIntegration {
  readonly snsClient: SNSClient;
  readonly region: string;

  constructor(
    readonly ConfigService: ConfigService,
    readonly ExceptionsAdapter: ExceptionsAdapter,
  ) {
    const accessKeyId = this.ConfigService.get<string>('SNS_ACCESS_KEY_ID');
    const secretAccessKey = this.ConfigService.get<string>('SNS_SECRET_ACCESS_KEY');
    const region = this.ConfigService.get<string>('SNS_REGION');

    if (!accessKeyId || !secretAccessKey || !region) {
      throw this.ExceptionsAdapter.internalServerError({
        message: 'SNS environment variables missing',
      });
    }

    this.region = region;

    this.snsClient = new SNSClient({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }
}
