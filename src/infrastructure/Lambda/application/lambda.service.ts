import { Injectable } from '@nestjs/common';
import { LambdaAdapter } from '@/infrastructure/Lambda/lambda.adapter';
import { InvokeLambdaParams, LambdaResponse } from '@/infrastructure/Lambda/lambda.types';
import { InvokeLambdaService } from './invoke-lambda.service';
import { InvokeLambdaAsyncService } from './invoke-lambda-async.service';

@Injectable()
export class LambdaService implements LambdaAdapter {
  constructor(
    private readonly InvokeLambdaService: InvokeLambdaService,
    private readonly InvokeLambdaAsyncService: InvokeLambdaAsyncService,
  ) {}

  async invoke<T = unknown>(params: InvokeLambdaParams): Promise<LambdaResponse<T>> {
    return this.InvokeLambdaService.execute<T>(params);
  }

  async invokeAsync(params: InvokeLambdaParams): Promise<void> {
    return this.InvokeLambdaAsyncService.execute(params);
  }
}
