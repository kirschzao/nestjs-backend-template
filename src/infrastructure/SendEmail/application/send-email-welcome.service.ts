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
export class SendEmailWelcomeService extends SendEmailHelperIntegration {
  constructor(
    readonly ConfigService: ConfigService,
    readonly LoggerAdapter: LoggerAdapter,
    readonly ExceptionsAdapter: ExceptionsAdapter,
  ) {
    super(ConfigService, ExceptionsAdapter);
  }

  async execute(email: string, name?: string, password?: string): Promise<void> {
    const subject = 'Seja Bem-vindo(a)!';
    const bodyHtml = this.loadTemplate(email, password, name);

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
      this.LoggerAdapter.log({
        where: 'SendEmailWelcomeService',
        message: `SendEmailWelcomeService.execute: Sending welcome email to: ${email}`,
      });
      await this.sesClient.send(command);
    } catch (error) {
      this.LoggerAdapter.fatal({
        where: 'SendEmailWelcomeService',
        message: `Error sending welcome email to: ${email}. Error: ${error}`,
      });
      this.ExceptionsAdapter.internalServerError({
        message: 'Error trying to send welcome email.',
      });
      throw error;
    }
  }

  private loadTemplate(email?: string, password?: string, name?: string): string {
    try {
      const templatePath = path.join(__dirname, '..', 'templates', 'welcome-template.html');
      let html = fs.readFileSync(templatePath, 'utf-8');

      html = html
        .replace(/{{USER}}/g, name || '')
        .replace(/{{EMAIL}}/g, email || '')
        .replace(/{{PASSWORD}}/g, password || '');

      return html;
    } catch (error) {
      this.LoggerAdapter.fatal({
        where: 'SendEmailWelcomeService',
        message: `Error loading welcome email template. Error: ${error}`,
      });
      throw this.ExceptionsAdapter.internalServerError({
        message: 'Error trying to load email template.',
        internalKey: SendEmailExceptions.EMAIL_LOADING_FAILED,
      });
    }
  }
}
