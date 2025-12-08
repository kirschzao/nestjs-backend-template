import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '@/global/common/decorators/public.decorator';
import {
  SignupDecorator,
  SignupRequestDTO,
} from '@/modules/Auth/signup/application/dtos/signup.dto';
import {
  ValidateSignupDecorator,
  ValidateSignupDTO,
} from '@/modules/Auth/signup/application/dtos/validate.dto';
import { SignupService } from '@/modules/Auth/signup/application/services/signup.service';
import { ValidateSignupService } from '@/modules/Auth/signup/application/services/validate.signup.service';

@Controller('signup')
@ApiTags('Signup')
export class SignupController {
  constructor(
    private readonly SignupService: SignupService,
    private readonly ValidateSignupService: ValidateSignupService,
  ) {}

  @SignupDecorator
  @Public()
  @Post('')
  async validateSignup(@Body() body: SignupRequestDTO) {
    return await this.SignupService.execute(body);
  }

  @ValidateSignupDecorator
  @Public()
  @Post('validate')
  async validateToken(@Body() validateSignupDTO: ValidateSignupDTO) {
    return await this.ValidateSignupService.execute(validateSignupDTO);
  }
}
