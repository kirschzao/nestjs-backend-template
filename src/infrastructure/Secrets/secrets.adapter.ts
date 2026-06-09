import { CreateSecretParams, UpdateSecretParams } from './secrets.types';

export abstract class SecretsAdapter {
  abstract getSecret(secretId: string): Promise<string | undefined>;
  abstract getSecretJSON<T = unknown>(secretId: string): Promise<T | undefined>;
  abstract createSecret(params: CreateSecretParams): Promise<string | undefined>;
  abstract updateSecret(params: UpdateSecretParams): Promise<void>;
  abstract deleteSecret(secretId: string): Promise<void>;
}
