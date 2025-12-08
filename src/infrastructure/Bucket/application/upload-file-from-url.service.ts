import { BucketHelperIntegration } from './bucket-helper-integration';
import { Upload } from '@aws-sdk/lib-storage';
import { Readable } from 'stream';
import { ExceptionsAdapter } from '@/infrastructure/Exceptions/exceptions.adapter';
import { Injectable } from '@nestjs/common';
import { StorageExceptions } from '@/infrastructure/Exceptions/exceptions.types';
import { ConfigService } from '@nestjs/config';
import { LoggerAdapter } from '@/infrastructure/Logger/logger.adapter';
import * as path from 'path';

@Injectable()
export class UploadFileFromUrlService extends BucketHelperIntegration {
  constructor(
    readonly configService: ConfigService,
    readonly LoggerAdapter: LoggerAdapter,
    readonly exceptionsAdapter: ExceptionsAdapter,
  ) {
    super(configService, exceptionsAdapter);
  }

  async execute(fileUrl: string, fileKey: string): Promise<string | undefined> {
    const response = await fetch(fileUrl);
    if (!response.ok || !response.body) {
      throw this.exceptionsAdapter.internalServerError({
        message: `Failed to fetch file from URL: ${response.statusText}`,
        internalKey: StorageExceptions.STORAGE_FILE_NOT_FOUND,
      });
    }

    const contentType = response.headers.get('content-type') || 'application/octet-stream';

    const directory = path.posix.dirname(fileKey);
    const originalFilename = path.posix.basename(fileKey);

    const sanitizedFilename = originalFilename
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w.-]/g, '-')
      .replace(/--+/g, '-');

    const finalKey = path.join(directory, sanitizedFilename);

    const upload = new Upload({
      client: this.s3Client,
      params: {
        Bucket: this.bucketName,
        Key: finalKey,
        Body: response.body as unknown as Readable,
        ContentType: contentType,
      },
    });

    try {
      await upload.done();
      return finalKey;
    } catch (error) {
      this.LoggerAdapter.error({
        where: 'UploadFileFromUrlService',
        message: `Error uploading file from URL: ${fileUrl} to bucket with key: ${finalKey}. Error: ${error}`,
      });
      this.exceptionsAdapter.internalServerError({
        message: 'Internal error while trying to upload the file from URL to the bucket.',
        internalKey: StorageExceptions.STORAGE_UPLOAD_FAILED,
      });
    }
  }
}
