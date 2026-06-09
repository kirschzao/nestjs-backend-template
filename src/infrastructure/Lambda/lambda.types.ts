export type LambdaInvocationType = 'RequestResponse' | 'Event' | 'DryRun';

export interface InvokeLambdaParams {
  functionName: string;
  payload?: unknown;
  invocationType?: LambdaInvocationType;
}

export interface LambdaResponse<T = unknown> {
  statusCode: number;
  payload: T | undefined;
}
