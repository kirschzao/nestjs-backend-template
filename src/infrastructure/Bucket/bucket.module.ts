import { BucketAdapter } from '@/infrastructure/Bucket/bucket.adapter';
import { Global, Module } from '@nestjs/common';
import { BucketService } from './application/bucket.service';
import { DeleteFileService } from './application/delete-file.service';
import { GetSignedUrlForExternalReadService } from './application/get-signed-url-external.service';
import { GetSignedUrlForInternalReadService } from './application/get-signed-url-internal.service';
import { UploadFileService } from './application/upload-file.service';
import { UploadFileFromUrlService } from './application/upload-file-from-url.service';
import { GetPutObjectUrlService } from './application/get-put-object-url.service';

@Global()
@Module({
  providers: [
    DeleteFileService,
    GetSignedUrlForExternalReadService,
    GetSignedUrlForInternalReadService,
    UploadFileService,
    UploadFileFromUrlService,
    GetPutObjectUrlService,
    {
      provide: BucketAdapter,
      useClass: BucketService,
    },
  ],
  exports: [
    {
      provide: BucketAdapter,
      useClass: BucketService,
    },
  ],
  imports: [],
})
export class BucketModule {}
