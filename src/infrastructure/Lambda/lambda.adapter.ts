import { InvokeLambdaParams, LambdaResponse } from './lambda.types';

export abstract class LambdaAdapter {
  abstract invoke<T = unknown>(params: InvokeLambdaParams): Promise<LambdaResponse<T>>;
  abstract invokeAsync(params: InvokeLambdaParams): Promise<void>;
}
