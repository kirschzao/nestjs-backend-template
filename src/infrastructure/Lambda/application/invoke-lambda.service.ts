import { Injectable } from '@nestjs/common';
import { InvokeCommand } from '@aws-sdk/client-lambda';
import { ConfigService } from '@nestjs/config';
import { ExceptionsAdapter } from '@/infrastructure/Exceptions/exceptions.adapter';
import { LoggerAdapter } from '@/infrastructure/Logger/logger.adapter';
import { LambdaHelperIntegration } from './lambda-helper-integration';
import { InvokeLambdaParams, LambdaResponse } from '@/infrastructure/Lambda/lambda.types';
import { LambdaExceptions } from '@/infrastructure/Exceptions/exceptions.types';

@Injectable()
export class InvokeLambdaService extends LambdaHelperIntegration {
  constructor(
    readonly ConfigService: ConfigService,
    readonly ExceptionsAdapter: ExceptionsAdapter,
    private readonly LoggerAdapter: LoggerAdapter,
  ) {
    super(ConfigService, ExceptionsAdapter);
  }

  async execute<T = unknown>(params: InvokeLambdaParams): Promise<LambdaResponse<T>> {
    const command = new InvokeCommand({
      FunctionName: params.functionName,
      InvocationType: params.invocationType ?? 'RequestResponse',
      Payload: params.payload ? Buffer.from(JSON.stringify(params.payload)) : undefined,
    });

    try {
      const result = await this.lambdaClient.send(command);

      let payload: T | undefined;
      if (result.Payload) {
        const raw = Buffer.from(result.Payload).toString('utf-8');
        try {
          payload = JSON.parse(raw) as T;
        } catch {
          payload = raw as T;
        }
      }

      return {
        statusCode: result.StatusCode ?? 200,
        payload,
      };
    } catch (error) {
      this.LoggerAdapter.error({
        where: 'InvokeLambdaService',
        message: `Error invoking lambda ${params.functionName}: ${error instanceof Error ? error.message : error}`,
      });
      throw this.ExceptionsAdapter.internalServerError({
        message: 'Failed to invoke Lambda function',
        internalKey: LambdaExceptions.LAMBDA_INVOKE_FAILED,
      });
    }
  }
}
