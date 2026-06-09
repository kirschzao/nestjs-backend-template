import { Injectable } from '@nestjs/common';
import { UnsubscribeCommand } from '@aws-sdk/client-sns';
import { ConfigService } from '@nestjs/config';
import { ExceptionsAdapter } from '@/infrastructure/Exceptions/exceptions.adapter';
import { LoggerAdapter } from '@/infrastructure/Logger/logger.adapter';
import { SNSHelperIntegration } from './sns-helper-integration';
import { SNSExceptions } from '@/infrastructure/Exceptions/exceptions.types';

@Injectable()
export class UnsubscribeTopicService extends SNSHelperIntegration {
  constructor(
    readonly ConfigService: ConfigService,
    readonly ExceptionsAdapter: ExceptionsAdapter,
    private readonly LoggerAdapter: LoggerAdapter,
  ) {
    super(ConfigService, ExceptionsAdapter);
  }

  async execute(subscriptionArn: string): Promise<void> {
    const command = new UnsubscribeCommand({ SubscriptionArn: subscriptionArn });

    try {
      await this.snsClient.send(command);
    } catch (error) {
      this.LoggerAdapter.error({
        where: 'UnsubscribeTopicService',
        message: `Error unsubscribing ${subscriptionArn}: ${error instanceof Error ? error.message : error}`,
      });
      throw this.ExceptionsAdapter.internalServerError({
        message: 'Failed to unsubscribe from SNS topic',
        internalKey: SNSExceptions.SNS_UNSUBSCRIBE_FAILED,
      });
    }
  }
}
