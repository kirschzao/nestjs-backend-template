import { Injectable } from '@nestjs/common';
import { PublishCommand, MessageAttributeValue } from '@aws-sdk/client-sns';
import { ConfigService } from '@nestjs/config';
import { ExceptionsAdapter } from '@/infrastructure/Exceptions/exceptions.adapter';
import { LoggerAdapter } from '@/infrastructure/Logger/logger.adapter';
import { SNSHelperIntegration } from './sns-helper-integration';
import { PublishToTopicParams } from '@/infrastructure/SNS/sns.types';
import { SNSExceptions } from '@/infrastructure/Exceptions/exceptions.types';

@Injectable()
export class PublishToTopicService extends SNSHelperIntegration {
  constructor(
    readonly ConfigService: ConfigService,
    readonly ExceptionsAdapter: ExceptionsAdapter,
    private readonly LoggerAdapter: LoggerAdapter,
  ) {
    super(ConfigService, ExceptionsAdapter);
  }

  async execute(params: PublishToTopicParams): Promise<string | undefined> {
    const messageAttributes: Record<string, MessageAttributeValue> = {};

    if (params.attributes) {
      for (const [key, value] of Object.entries(params.attributes)) {
        messageAttributes[key] = {
          DataType: 'String',
          StringValue: value,
        };
      }
    }

    const command = new PublishCommand({
      TopicArn: params.topicArn,
      Message: params.message,
      Subject: params.subject,
      MessageAttributes: Object.keys(messageAttributes).length > 0 ? messageAttributes : undefined,
    });

    try {
      const result = await this.snsClient.send(command);
      return result.MessageId;
    } catch (error) {
      this.LoggerAdapter.error({
        where: 'PublishToTopicService',
        message: `Error publishing to topic ${params.topicArn}: ${error instanceof Error ? error.message : error}`,
      });
      throw this.ExceptionsAdapter.internalServerError({
        message: 'Failed to publish message to topic',
        internalKey: SNSExceptions.SNS_PUBLISH_FAILED,
      });
    }
  }
}
