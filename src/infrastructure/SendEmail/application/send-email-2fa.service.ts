import { SendEmailCommand } from '@aws-sdk/client-ses';
import { SendEmailHelperIntegration } from '@/infrastructure/SendEmail/application/send-email-Helper-integration';
import { ExceptionsAdapter } from '@/infrastructure/Exceptions/exceptions.adapter';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SendEmailExceptions } from '@/infrastructure/Exceptions/exceptions.types';
import { LoggerAdapter } from '@/infrastructure/Logger/logger.adapter';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class SendEmail2FAService extends SendEmailHelperIntegration {
  constructor(
    readonly ConfigService: ConfigService,
    readonly LoggerAdapter: LoggerAdapter,
    readonly ExceptionsAdapter: ExceptionsAdapter,
  ) {
    super(ConfigService, ExceptionsAdapter);
  }

  async execute(email: string, code: string, name?: string): Promise<void> {
    const subject = 'Código de Verificação';
    const bodyHtml = this.loadTemplate(code, name);

    const command = new SendEmailCommand({
      Source: this.senderEmail,
      Destination: {
        ToAddresses: [email],
      },
      Message: {
        Subject: {
          Data: subject,
          Charset: 'UTF-8',
        },
        Body: {
          Html: {
            Data: bodyHtml,
            Charset: 'UTF-8',
          },
        },
      },
    });

    try {
      await this.sesClient.send(command);
    } catch (error) {
      this.LoggerAdapter.error({
        where: 'SendEmail2FAService',
        message: `Error sending 2FA email to: ${email} with code: ${code}. Error: ${error}`,
      });
      throw this.ExceptionsAdapter.internalServerError({
        message: 'Trying to send 2FA email failed.',
        internalKey: SendEmailExceptions.EMAIL_SENDING_FAILED,
      });
    }
  }

  private loadTemplate(code: string, name?: string): string {
    try {
      const templatePath = path.join(__dirname, '..', 'templates', '2fa-template.html');
      let html = fs.readFileSync(templatePath, 'utf-8');

      html = html.replace(/{{CODE}}/g, code);
      html = html.replace(/{{USER}}/g, name || '');

      return html;
    } catch (error) {
      this.LoggerAdapter.error({
        where: 'SendEmail2FAService',
        message: `Error loading 2FA email template with code: ${code}. Error: ${error}`,
      });
      throw this.ExceptionsAdapter.internalServerError({
        message: 'Trying to send 2FA email failed.',
      });
    }
  }
}
