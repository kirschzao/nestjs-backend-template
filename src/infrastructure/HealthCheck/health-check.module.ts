import { Module, Global } from '@nestjs/common';
import { HealthCheckAdapter } from './health-check.adapter';
import { HealthCheckService } from './application/health-check.service';
import { HealthCheckController } from './health-check.controller';

@Global()
@Module({
  controllers: [HealthCheckController],
  providers: [
    {
      provide: HealthCheckAdapter,
      useClass: HealthCheckService,
    },
  ],
  exports: [HealthCheckAdapter],
})
export class HealthCheckModule {}
