export interface CreateSecretParams {
  name: string;
  value: string;
  description?: string;
}

export interface UpdateSecretParams {
  secretId: string;
  value: string;
}
