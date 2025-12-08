import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { RefererGuard } from '@/global/common/guards/refer.guard';

export function AllowFrom(allowedReferers: string[]) {
  return applyDecorators(
    SetMetadata('allowedReferers', allowedReferers),
    UseGuards(RefererGuard),
  );
}
