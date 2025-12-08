import { Module } from '@nestjs/common';
import { LoginController } from '@/modules/Auth/login/infra/presentation/login.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '@/global/common/strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { RefreshTokenStrategy } from '@/global/common/strategies/refresh-token.strategy';
import { WsJwtStrategy } from '@/global/common/strategies/ws-jwt.strategy';
import { LoginService } from '@/modules/Auth/login/application/services/login.service';
import { RefreshTokenService } from '@/modules/Auth/login/application/services/refresh-tokens.service';
import { SignupService } from '@/modules/Auth/signup/application/services/signup.service';
import { ValidateSignupService } from '@/modules/Auth/signup/application/services/validate.signup.service';
import { StringValue } from 'ms';
import { CryptographyModule } from '@/infrastructure/Criptography/criptography.module';
import { SendEmailModule } from '@/infrastructure/SendEmail/sendEmail.module';
import { RequestResetPasswordService } from '@/modules/Auth/resetPassword/application/services/request-reset-password.service';
import { IsValidateResetPasswordService } from '@/modules/Auth/resetPassword/application/services/validate-reset-password.service';
import { ResetPasswordService } from '@/modules/Auth/resetPassword/application/services/reset-password.service';
import { LogoutService } from '@/modules/Auth/login/application/services/logout.service';
import { ValidateVerifyPhoneService } from '@/modules/Auth/verifyPhone/application/services/validate.verify-phone.service';
import { VerifyPhoneService } from '@/modules/Auth/verifyPhone/application/services/verify-phone.service';
import { SignupController } from '@/modules/Auth/signup/infra/presentation/signup.controller';
import { ResetPasswordController } from '@/modules/Auth/resetPassword/infra/presentation/reset-password.controller';
import { VerifyPhoneController } from '@/modules/Auth/verifyPhone/infra/presentation/verify-phone.controller';
import { ClearAuthCookiesService } from '@/modules/Auth/login/application/services/clear-auth-cookie.service';
import { SetAuthCookiesService } from '@/modules/Auth/login/application/services/set-auth-cookies.service';

@Module({
  imports: [
    SendEmailModule,
    CryptographyModule,
    PassportModule,
    JwtModule.register({
      global: true,
      secret: process.env.ACCESS_TOKEN_SECRET,
      signOptions: { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION as StringValue },
    }),
  ],
  controllers: [LoginController, SignupController, ResetPasswordController, VerifyPhoneController],
  providers: [
    LoginService,
    LogoutService,
    ClearAuthCookiesService,
    SetAuthCookiesService,
    RefreshTokenService,
    JwtStrategy,
    RefreshTokenStrategy,
    WsJwtStrategy,
    SignupService,
    ValidateSignupService,
    RequestResetPasswordService,
    IsValidateResetPasswordService,
    ResetPasswordService,
    VerifyPhoneService,
    ValidateVerifyPhoneService,
  ],
})
export class AuthModule {}
