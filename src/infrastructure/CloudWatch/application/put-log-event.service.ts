import { Injectable } from '@nestjs/common';
import { PutLogEventsCommand } from '@aws-sdk/client-cloudwatch-logs';
import { ConfigService } from '@nestjs/config';
import { ExceptionsAdapter } from '@/infrastructure/Exceptions/exceptions.adapter';
import { LoggerAdapter } from '@/infrastructure/Logger/logger.adapter';
import { CloudWatchHelperIntegration } from './cloud-watch-helper-integration';
import { CloudWatchLogEvent } from '@/infrastructure/CloudWatch/cloud-watch.types';

@Injectable()
export class PutLogEventService extends CloudWatchHelperIntegration {
  constructor(
    readonly ConfigService: ConfigService,
    readonly ExceptionsAdapter: ExceptionsAdapter,
    private readonly LoggerAdapter: LoggerAdapter,
  ) {
    super(ConfigService, ExceptionsAdapter);
  }

  async execute(logGroupName: string, logStreamName: string, events: CloudWatchLogEvent[]): Promise<void> {
    const command = new PutLogEventsCommand({
      logGroupName,
      logStreamName,
      logEvents: events,
    });

    try {
      await this.cloudWatchClient.send(command);
    } catch (error) {
      this.LoggerAdapter.error({
        where: 'PutLogEventService',
        message: `Error sending logs to CloudWatch: ${error instanceof Error ? error.message : error}`,
      });
    }
  }
}
