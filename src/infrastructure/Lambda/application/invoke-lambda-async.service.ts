import { Injectable } from '@nestjs/common';
import { InvokeCommand } from '@aws-sdk/client-lambda';
import { ConfigService } from '@nestjs/config';
import { ExceptionsAdapter } from '@/infrastructure/Exceptions/exceptions.adapter';
import { LoggerAdapter } from '@/infrastructure/Logger/logger.adapter';
import { LambdaHelperIntegration } from './lambda-helper-integration';
import { InvokeLambdaParams } from '@/infrastructure/Lambda/lambda.types';
import { LambdaExceptions } from '@/infrastructure/Exceptions/exceptions.types';

@Injectable()
export class InvokeLambdaAsyncService extends LambdaHelperIntegration {
  constructor(
    readonly ConfigService: ConfigService,
    readonly ExceptionsAdapter: ExceptionsAdapter,
    private readonly LoggerAdapter: LoggerAdapter,
  ) {
    super(ConfigService, ExceptionsAdapter);
  }

  async execute(params: InvokeLambdaParams): Promise<void> {
    const command = new InvokeCommand({
      FunctionName: params.functionName,
      InvocationType: 'Event',
      Payload: params.payload ? Buffer.from(JSON.stringify(params.payload)) : undefined,
    });

    try {
      await this.lambdaClient.send(command);
    } catch (error) {
      this.LoggerAdapter.error({
        where: 'InvokeLambdaAsyncService',
        message: `Error invoking lambda async ${params.functionName}: ${error instanceof Error ? error.message : error}`,
      });
      throw this.ExceptionsAdapter.internalServerError({
        message: 'Failed to invoke Lambda function asynchronously',
        internalKey: LambdaExceptions.LAMBDA_INVOKE_FAILED,
      });
    }
  }
}
