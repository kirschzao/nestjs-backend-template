import { Injectable } from '@nestjs/common';
import { CreateTopicCommand } from '@aws-sdk/client-sns';
import { ConfigService } from '@nestjs/config';
import { ExceptionsAdapter } from '@/infrastructure/Exceptions/exceptions.adapter';
import { LoggerAdapter } from '@/infrastructure/Logger/logger.adapter';
import { SNSHelperIntegration } from './sns-helper-integration';
import { CreateTopicParams } from '@/infrastructure/SNS/sns.types';
import { SNSExceptions } from '@/infrastructure/Exceptions/exceptions.types';

@Injectable()
export class CreateTopicService extends SNSHelperIntegration {
  constructor(
    readonly ConfigService: ConfigService,
    readonly ExceptionsAdapter: ExceptionsAdapter,
    private readonly LoggerAdapter: LoggerAdapter,
  ) {
    super(ConfigService, ExceptionsAdapter);
  }

  async execute(params: CreateTopicParams): Promise<string | undefined> {
    const command = new CreateTopicCommand({ Name: params.name });

    try {
      const result = await this.snsClient.send(command);
      this.LoggerAdapter.log({
        where: 'CreateTopicService',
        message: `Topic created: ${params.name} | ARN: ${result.TopicArn}`,
      });
      return result.TopicArn;
    } catch (error) {
      this.LoggerAdapter.error({
        where: 'CreateTopicService',
        message: `Error creating topic ${params.name}: ${error instanceof Error ? error.message : error}`,
      });
      throw this.ExceptionsAdapter.internalServerError({
        message: 'Failed to create SNS topic',
        internalKey: SNSExceptions.SNS_TOPIC_FAILED,
      });
    }
  }
}
