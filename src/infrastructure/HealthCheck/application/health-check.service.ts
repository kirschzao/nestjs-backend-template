import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infrastructure/Database/prisma.service';
import { CacheAdapter } from '@/infrastructure/Cache/cache.adapter';
import { HealthCheckAdapter } from '@/infrastructure/HealthCheck/health-check.adapter';
import { HealthCheckResult, ServiceHealth } from '@/infrastructure/HealthCheck/health-check.types';

const TIMEOUT_MS = 3000;

@Injectable()
export class HealthCheckService implements HealthCheckAdapter {
  constructor(
    private readonly PrismaService: PrismaService,
    private readonly CacheAdapter: CacheAdapter,
  ) {}

  async check(): Promise<HealthCheckResult> {
    const [database, redis] = await Promise.all([
      this.checkDatabase(),
      this.checkRedis(),
    ]);

    const allHealthy = database.status === 'healthy' && redis.status === 'healthy';
    const dbDown = database.status === 'unhealthy';

    return {
      status: dbDown ? 'unhealthy' : allHealthy ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      services: { database, redis },
    };
  }

  private async checkDatabase(): Promise<ServiceHealth> {
    const start = Date.now();

    try {
      await Promise.race([
        this.PrismaService.$queryRawUnsafe('SELECT 1'),
        this.timeout(),
      ]);

      return { status: 'healthy', latencyMs: Date.now() - start };
    } catch (error) {
      return {
        status: 'unhealthy',
        latencyMs: Date.now() - start,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  private async checkRedis(): Promise<ServiceHealth> {
    const start = Date.now();

    try {
      await Promise.race([
        this.CacheAdapter.ping(),
        this.timeout(),
      ]);

      return { status: 'healthy', latencyMs: Date.now() - start };
    } catch (error) {
      return {
        status: 'unhealthy',
        latencyMs: Date.now() - start,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  private timeout(): Promise<never> {
    return new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Health check timed out')), TIMEOUT_MS),
    );
  }
}
