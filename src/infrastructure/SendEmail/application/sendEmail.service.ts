import { Injectable } from '@nestjs/common';
import { SendEmailAdapter } from '../sendEmail.adapter';
import { SendEmail2FAService } from '@/infrastructure/SendEmail/application/send-email-2fa.service';
import { SendEmailResetPasswordService } from '@/infrastructure/SendEmail/application/send-email-reset-password.service';
import { SendEmailWelcomeService } from '@/infrastructure/SendEmail/application/send-email-welcome.service';
import { SendEmailPasswordChangedService } from '@/infrastructure/SendEmail/application/send-email-password-changed.service';
@Injectable()
export class SendEmailService implements SendEmailAdapter {
  constructor(
    private readonly SendEmail2FAService: SendEmail2FAService,
    private readonly SendEmailResetPasswordService: SendEmailResetPasswordService,
    private readonly SendEmailWelcomeService: SendEmailWelcomeService,
    private readonly SendEmailPasswordChangedService: SendEmailPasswordChangedService,
  ) {}

  async sendEmail2FA(email: string, code: string, name?: string): Promise<void> {
    return await this.SendEmail2FAService.execute(email, code, name);
  }

  async sendEmailResetPassword(email: string, code: string, name?: string): Promise<void> {
    return await this.SendEmailResetPasswordService.execute(email, code, name);
  }

  async sendEmailWelcome(email: string, name?: string, password?: string): Promise<void> {
    return await this.SendEmailWelcomeService.execute(email, name, password);
  }

  async sendEmailPaswordChanged(email: string, name?: string): Promise<void> {
    return await this.SendEmailPasswordChangedService.execute(email, name);
  }
}
