import { BucketHelperIntegration } from './bucket-helper-integration';
import { ExceptionsAdapter } from '@/infrastructure/Exceptions/exceptions.adapter';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StorageExceptions } from '@/infrastructure/Exceptions/exceptions.types';
import { LoggerAdapter } from '@/infrastructure/Logger/logger.adapter';

@Injectable()
export class GetSignedUrlForInternalReadService extends BucketHelperIntegration {
  constructor(
    readonly ConfigService: ConfigService,
    readonly LoggerAdapter: LoggerAdapter,
    readonly ExceptionsAdapter: ExceptionsAdapter,
  ) {
    super(ConfigService, ExceptionsAdapter);
  }

  execute(fileKey: string): string {
    if (!fileKey) {
      throw this.ExceptionsAdapter.badRequest({
        message: 'URL required to generate signed URL for read.',
        internalKey: StorageExceptions.STORAGE_URL_NOT_PROVIDED,
      });
    }

    const url = `https://${this.fileDomainPrefix}/${fileKey}`;
    return url;
  }
}
