import { SESClient } from '@aws-sdk/client-ses';
import { ExceptionsAdapter } from '@/infrastructure/Exceptions/exceptions.adapter';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SendEmailHelperIntegration {
  readonly sesClient: SESClient;
  readonly senderEmail: string;
  readonly senderName: string;

  constructor(
    readonly ConfigService: ConfigService,
    readonly ExceptionsAdapter: ExceptionsAdapter,
  ) {
    const accessKeyId = this.ConfigService.get<string>('SES_ACCESS_KEY_ID');
    const secretAccessKey = this.ConfigService.get<string>('SES_SECRET_ACCESS_KEY');
    const region = this.ConfigService.get<string>('SES_REGION');
    const senderEmail = this.ConfigService.get<string>('SES_SENDER_EMAIL');
    const senderName = this.ConfigService.get<string>('SES_SENDER_NAME');

    if (!accessKeyId || !secretAccessKey || !region || !senderEmail || !senderName) {
      throw this.ExceptionsAdapter.internalServerError({
        message: 'SES environment variables missing',
      });
    }

    this.senderEmail = `"${senderName}" <${senderEmail}>`;

    const sesClientConfig: {
      region: string;
      credentials: { accessKeyId: string; secretAccessKey: string };
    } = {
      region: region,
      credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
      },
    };

    this.sesClient = new SESClient(sesClientConfig);
  }
}
