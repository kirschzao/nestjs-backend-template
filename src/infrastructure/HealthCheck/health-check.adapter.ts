import { HealthCheckResult } from './health-check.types';

export abstract class HealthCheckAdapter {
  abstract check(): Promise<HealthCheckResult>;
}
