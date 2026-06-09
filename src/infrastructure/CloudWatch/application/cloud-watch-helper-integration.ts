import { Injectable } from '@nestjs/common';
import { CloudWatchLogsClient } from '@aws-sdk/client-cloudwatch-logs';
import { ConfigService } from '@nestjs/config';
import { ExceptionsAdapter } from '@/infrastructure/Exceptions/exceptions.adapter';

@Injectable()
export class CloudWatchHelperIntegration {
  readonly cloudWatchClient: CloudWatchLogsClient;

  constructor(
    readonly ConfigService: ConfigService,
    readonly ExceptionsAdapter: ExceptionsAdapter,
  ) {
    const accessKeyId = this.ConfigService.get<string>('CLOUDWATCH_ACCESS_KEY_ID');
    const secretAccessKey = this.ConfigService.get<string>('CLOUDWATCH_SECRET_ACCESS_KEY');
    const region = this.ConfigService.get<string>('CLOUDWATCH_REGION');

    if (!accessKeyId || !secretAccessKey || !region) {
      throw this.ExceptionsAdapter.internalServerError({
        message: 'CloudWatch environment variables missing',
      });
    }

    this.cloudWatchClient = new CloudWatchLogsClient({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }
}
