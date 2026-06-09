import { Controller, Get, HttpCode, HttpStatus, Res } from '@nestjs/common';
import { Response } from 'express';
import { Public } from '@/global/common/decorators/public.decorator';
import { HealthCheckAdapter } from './health-check.adapter';

@Controller('health')
export class HealthCheckController {
  constructor(private readonly HealthCheckAdapter: HealthCheckAdapter) {}

  @Public()
  @Get()
  @HttpCode(HttpStatus.OK)
  async check(@Res() res: Response) {
    const result = await this.HealthCheckAdapter.check();

    const statusCode =
      result.status === 'unhealthy' ? HttpStatus.SERVICE_UNAVAILABLE : HttpStatus.OK;

    return res.status(statusCode).json(result);
  }
}
