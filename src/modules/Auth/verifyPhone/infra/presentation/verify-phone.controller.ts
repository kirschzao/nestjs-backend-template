import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ValidateVerifyPhoneService } from '@/modules/Auth/verifyPhone/application/services/validate.verify-phone.service';
import { VerifyPhoneService } from '@/modules/Auth/verifyPhone/application/services/verify-phone.service';
import {
  ValidateVerifyPhoneDTO,
  ValidateVerifyPhoneDecorator,
} from '@/modules/Auth/verifyPhone/application/dtos/verify-phone-validate.dto';
import {
  VerifyPhoneRequestDTO,
  VerifyPhoneRequestDecorator,
} from '@/modules/Auth/verifyPhone/application/dtos/verify-phone.dto';
import { GetUser } from '@/global/common/decorators/get-user.decorator';

@Controller('verify-phone')
@ApiTags('Verify Phone')
export class VerifyPhoneController {
  constructor(
    private readonly VerifyPhoneService: VerifyPhoneService,
    private readonly ValidateVerifyPhoneService: ValidateVerifyPhoneService,
  ) {}

  @ValidateVerifyPhoneDecorator
  @Post('validate')
  async validateVerifyPhone(@Body() body: ValidateVerifyPhoneDTO, @GetUser() user) {
    return await this.ValidateVerifyPhoneService.execute(String(user.id), body);
  }

  @VerifyPhoneRequestDecorator
  @Post('')
  async verifyPhone(@Body() body: VerifyPhoneRequestDTO, @GetUser() user) {
    return await this.VerifyPhoneService.execute(String(user.id), body);
  }
}
