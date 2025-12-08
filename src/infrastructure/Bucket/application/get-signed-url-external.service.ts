import { GetObjectCommand } from '@aws-sdk/client-s3';
import { BucketHelperIntegration } from './bucket-helper-integration';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ExceptionsAdapter } from '@/infrastructure/Exceptions/exceptions.adapter';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StorageExceptions } from '@/infrastructure/Exceptions/exceptions.types';
import { LoggerAdapter } from '@/infrastructure/Logger/logger.adapter';

@Injectable()
export class GetSignedUrlForExternalReadService extends BucketHelperIntegration {
  constructor(
    readonly configService: ConfigService,
    readonly LoggerAdapter: LoggerAdapter,
    readonly exceptionsAdapter: ExceptionsAdapter,
  ) {
    super(configService, exceptionsAdapter);
  }

  async execute(fileKey: string, expiresIn: number = 3600): Promise<string> {
    if (!fileKey) {
      throw this.exceptionsAdapter.badRequest({
        message: 'URL required to generate signed URL for read.',
        internalKey: StorageExceptions.STORAGE_URL_NOT_PROVIDED,
      });
    }
    const fileUrl = this.getFileKey(fileKey);
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: fileKey,
      });

      return await getSignedUrl(this.s3Client, command, { expiresIn });
    } catch (error) {
      this.LoggerAdapter.error({
        where: 'GetSignedUrlForReadService',
        message: `Error generating signed URL for read from fileUrl: ${fileUrl}. Error: ${error}`,
      });
      this.exceptionsAdapter.internalServerError({
        message: 'Error generating read presigned URL.',
        internalKey: StorageExceptions.STORAGE_FILE_NOT_FOUND,
      });
      throw error;
    }
  }
}
