import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { BucketHelperIntegration } from './bucket-helper-integration';
import { ExceptionsAdapter } from '@/infrastructure/Exceptions/exceptions.adapter';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StorageExceptions } from '@/infrastructure/Exceptions/exceptions.types';
import { LoggerAdapter } from '@/infrastructure/Logger/logger.adapter';

@Injectable()
export class DeleteFileService extends BucketHelperIntegration {
  constructor(
    readonly configService: ConfigService,
    readonly LoggerAdapter: LoggerAdapter,
    readonly exceptionsAdapter: ExceptionsAdapter,
  ) {
    super(configService, exceptionsAdapter);
  }

  async execute(fileKey: string): Promise<void> {
    if (!fileKey) {
      throw this.exceptionsAdapter.badRequest({
        message: 'URL required for file deletion.',
        internalKey: StorageExceptions.STORAGE_URL_NOT_PROVIDED,
      });
    }

    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: fileKey,
    });

    const deleteResult = await this.s3Client.send(command);

    if (deleteResult.$metadata.httpStatusCode !== 204) {
      this.LoggerAdapter.error({
        where: 'DeleteFileService',
        message: `Failed to delete file from bucket. FileKey: ${fileKey}`,
      });
      throw this.ExceptionsAdapter.internalServerError({
        message: 'Failed to delete file from bucket',
        internalKey: StorageExceptions.STORAGE_FILE_NOT_FOUND,
      });
    }
  }
}
