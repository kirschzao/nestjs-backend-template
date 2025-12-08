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
export class SendEmailPasswordChangedService extends SendEmailHelperIntegration {
  constructor(
    readonly ConfigService: ConfigService,
    readonly LoggerAdapter: LoggerAdapter,
    readonly ExceptionsAdapter: ExceptionsAdapter,
  ) {
    super(ConfigService, ExceptionsAdapter);
  }

  async execute(email: string, name?: string): Promise<void> {
    const subject = 'Sua senha foi alterada';
    const bodyHtml = this.loadTemplate(name);

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
      this.LoggerAdapter.verbose({
        where: 'SendEmailPasswordChangedService',
        message: `Sending password changed email to: ${email} with body: ${bodyHtml}`,
      });
      await this.sesClient.send(command);
    } catch (error) {
      this.LoggerAdapter.error({
        where: 'SendEmailPasswordChangedService',
        message: `Error sending password changed email to: ${email}. Error: ${error}`,
      });
      throw this.ExceptionsAdapter.internalServerError({
        message: 'Error trying to send password changed email.',
        internalKey: SendEmailExceptions.EMAIL_SENDING_FAILED,
      });
    }
  }

  private loadTemplate(name?: string): string {
    try {
      const templatePath = path.join(
        __dirname,
        '..',
        'templates',
        'password-changed-template.html',
      );
      let html = fs.readFileSync(templatePath, 'utf-8');

      html = html.replace(/{{USER}}/g, name || '');

      return html;
    } catch (error) {
      this.LoggerAdapter.fatal({
        where: 'SendEmailPasswordChangedService',
        message: `Error loading password changed email template. Error: ${error}`,
      });
      throw this.ExceptionsAdapter.internalServerError({
        message: 'Error trying to load email template.',
      });
    }
  }
}
