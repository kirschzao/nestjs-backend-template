import { Module } from '@nestjs/common';
import { SendEmailAdapter } from '@/infrastructure/SendEmail/sendEmail.adapter';
import { SendEmailService } from '@/infrastructure/SendEmail/application/sendEmail.service';
import { SendEmail2FAService } from '@/infrastructure/SendEmail/application/send-email-2fa.service';
import { SendEmailResetPasswordService } from '@/infrastructure/SendEmail/application/send-email-reset-password.service';
import { SendEmailWelcomeService } from '@/infrastructure/SendEmail/application/send-email-welcome.service';
import { SendEmailHelperIntegration } from '@/infrastructure/SendEmail/application/send-email-Helper-integration';
import { SendEmailPasswordChangedService } from '@/infrastructure/SendEmail/application/send-email-password-changed.service';

@Module({
  providers: [
    SendEmail2FAService,
    SendEmailResetPasswordService,
    SendEmailWelcomeService,
    SendEmailPasswordChangedService,
    SendEmailHelperIntegration,
    {
      provide: SendEmailAdapter,
      useClass: SendEmailService,
    },
  ],
  exports: [
    {
      provide: SendEmailAdapter,
      useClass: SendEmailService,
    },
  ],
  imports: [],
})
export class SendEmailModule {}
