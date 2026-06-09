import { Injectable } from '@nestjs/common';
import { PublishCommand } from '@aws-sdk/client-sns';
import { ConfigService } from '@nestjs/config';
import { ExceptionsAdapter } from '@/infrastructure/Exceptions/exceptions.adapter';
import { LoggerAdapter } from '@/infrastructure/Logger/logger.adapter';
import { SNSHelperIntegration } from './sns-helper-integration';
import { SendSmsParams } from '@/infrastructure/SNS/sns.types';
import { SNSExceptions } from '@/infrastructure/Exceptions/exceptions.types';

@Injectable()
export class SendSmsService extends SNSHelperIntegration {
  constructor(
    readonly ConfigService: ConfigService,
    readonly ExceptionsAdapter: ExceptionsAdapter,
    private readonly LoggerAdapter: LoggerAdapter,
  ) {
    super(ConfigService, ExceptionsAdapter);
  }

  async execute(params: SendSmsParams): Promise<void> {
    const command = new PublishCommand({
      PhoneNumber: params.phoneNumber,
      Message: params.message,
    });

    try {
      await this.snsClient.send(command);
      this.LoggerAdapter.log({
        where: 'SendSmsService',
        message: `SMS sent to ${params.phoneNumber}`,
      });
    } catch (error) {
      this.LoggerAdapter.error({
        where: 'SendSmsService',
        message: `Error sending SMS to ${params.phoneNumber}: ${error instanceof Error ? error.message : error}`,
      });
      throw this.ExceptionsAdapter.internalServerError({
        message: 'Failed to send SMS',
        internalKey: SNSExceptions.SNS_SMS_FAILED,
      });
    }
  }
}
