import { applyDecorators, UseGuards } from '@nestjs/common';
import { CorsGuard } from '../guards/cors.guard';

export function OnlyCors() {
  return applyDecorators(UseGuards(CorsGuard));
}
