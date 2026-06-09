import { Injectable } from '@nestjs/common';
import { SubscribeCommand } from '@aws-sdk/client-sns';
import { ConfigService } from '@nestjs/config';
import { ExceptionsAdapter } from '@/infrastructure/Exceptions/exceptions.adapter';
import { LoggerAdapter } from '@/infrastructure/Logger/logger.adapter';
import { SNSHelperIntegration } from './sns-helper-integration';
import { SubscribeParams } from '@/infrastructure/SNS/sns.types';
import { SNSExceptions } from '@/infrastructure/Exceptions/exceptions.types';

@Injectable()
export class SubscribeTopicService extends SNSHelperIntegration {
  constructor(
    readonly ConfigService: ConfigService,
    readonly ExceptionsAdapter: ExceptionsAdapter,
    private readonly LoggerAdapter: LoggerAdapter,
  ) {
    super(ConfigService, ExceptionsAdapter);
  }

  async execute(params: SubscribeParams): Promise<string | undefined> {
    const command = new SubscribeCommand({
      TopicArn: params.topicArn,
      Protocol: params.protocol,
      Endpoint: params.endpoint,
    });

    try {
      const result = await this.snsClient.send(command);
      return result.SubscriptionArn;
    } catch (error) {
      this.LoggerAdapter.error({
        where: 'SubscribeTopicService',
        message: `Error subscribing to topic ${params.topicArn}: ${error instanceof Error ? error.message : error}`,
      });
      throw this.ExceptionsAdapter.internalServerError({
        message: 'Failed to subscribe to SNS topic',
        internalKey: SNSExceptions.SNS_SUBSCRIBE_FAILED,
      });
    }
  }
}
