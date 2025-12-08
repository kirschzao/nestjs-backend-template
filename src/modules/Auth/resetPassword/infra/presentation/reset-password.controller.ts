import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '@/global/common/decorators/public.decorator';
import {
  ResetPasswordRequestDTO,
  ResetPasswordRequestDecorator,
} from '@/modules/Auth/resetPassword/application/dtos/request-token.dto';
import {
  ResetPasswordDecorator,
  ResetPasswordDTO,
} from '@/modules/Auth/resetPassword/application/dtos/reset-password.dto';
import {
  ValidateResetPasswordDecorator,
  ValidateResetPasswordDTO,
} from '@/modules/Auth/resetPassword/application/dtos/validate.dto';
import { RequestResetPasswordService } from '@/modules/Auth/resetPassword/application/services/request-reset-password.service';
import { ResetPasswordService } from '@/modules/Auth/resetPassword/application/services/reset-password.service';
import { IsValidateResetPasswordService } from '@/modules/Auth/resetPassword/application/services/validate-reset-password.service';

@Controller('reset-password')
@ApiTags('Reset Password')
export class ResetPasswordController {
  constructor(
    private readonly RequestResetPasswordService: RequestResetPasswordService,
    private readonly IsValidateResetPasswordService: IsValidateResetPasswordService,
    private readonly ResetPasswordService: ResetPasswordService,
  ) {}

  @ResetPasswordRequestDecorator
  @Public()
  @Post('request')
  async requestResetPassword(@Body() body: ResetPasswordRequestDTO) {
    return await this.RequestResetPasswordService.execute(body);
  }

  @ValidateResetPasswordDecorator
  @Public()
  @Post('validate')
  async validateResetPassword(@Body() body: ValidateResetPasswordDTO) {
    return await this.IsValidateResetPasswordService.execute(body);
  }

  @ResetPasswordDecorator
  @Public()
  @Post('')
  async resetPassword(@Body() body: ResetPasswordDTO) {
    return await this.ResetPasswordService.execute(body);
  }
}
