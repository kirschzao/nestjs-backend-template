import { PutObjectCommand } from '@aws-sdk/client-s3';
import { BucketHelperIntegration } from './bucket-helper-integration';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ExceptionsAdapter } from '@/infrastructure/Exceptions/exceptions.adapter';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StorageExceptions } from '@/infrastructure/Exceptions/exceptions.types';
import { LoggerAdapter } from '@/infrastructure/Logger/logger.adapter';

@Injectable()
export class GetPutObjectUrlService extends BucketHelperIntegration {
  constructor(
    readonly configService: ConfigService,
    readonly LoggerAdapter: LoggerAdapter,
    readonly exceptionsAdapter: ExceptionsAdapter,
  ) {
    super(configService, exceptionsAdapter);
  }

  async execute(
    fileKey: string,
    contentType: string,
    userId: string,
    expiresIn: number = 3600,
  ): Promise<string> {
    if (!fileKey || !contentType) {
      throw this.exceptionsAdapter.badRequest({
        message: 'Key and content type are required to generate presigned URL.',
        internalKey: StorageExceptions.STORAGE_FILE_NOT_FOUND,
      });
    }

    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: fileKey,
        ContentType: contentType,
        Metadata: {
          authorId: userId,
        },
      });

      const signedUrl = await getSignedUrl(this.s3Client, command, {
        expiresIn,
      });
      return signedUrl;
    } catch (error) {
      this.LoggerAdapter.error({
        where: 'GetPutObjectUrlService',
        message: `Error generating presigned URL for key: ${fileKey}, userId: ${userId}. Error: ${error}`,
      });
      this.exceptionsAdapter.internalServerError({
        message: 'Error generating upload presigned URL.',
        internalKey: StorageExceptions.STORAGE_FILE_NOT_FOUND,
      });
      throw error;
    }
  }
}
