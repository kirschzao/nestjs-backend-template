import { Injectable } from '@nestjs/common';
import { BucketAdapter } from '@/infrastructure/Bucket/bucket.adapter';
import { DeleteFileService } from './delete-file.service';
import { GetSignedUrlForExternalReadService } from './get-signed-url-external.service';
import { GetSignedUrlForInternalReadService } from './get-signed-url-internal.service';
import { UploadFileService } from './upload-file.service';
import { UploadFileFromUrlService } from './upload-file-from-url.service';
import { GetPutObjectUrlService } from './get-put-object-url.service';

@Injectable()
export class BucketService implements BucketAdapter {
  constructor(
    private readonly DeleteFileService: DeleteFileService,
    private readonly GetSignedUrlForExternalReadService: GetSignedUrlForExternalReadService,
    private readonly GetSignedUrlForInternalReadService: GetSignedUrlForInternalReadService,
    private readonly UploadFileService: UploadFileService,
    private readonly UploadFileFromUrlService: UploadFileFromUrlService,
    private readonly GetPutObjectUrlService: GetPutObjectUrlService,
  ) {}

  async deleteFile(fileKey: string): Promise<void> {
    return this.DeleteFileService.execute(fileKey);
  }

  async getSignedUrlForExternalRead(link: string, expiresIn?: number): Promise<string> {
    return this.GetSignedUrlForExternalReadService.execute(link, expiresIn);
  }

  getSignedUrlForInternalRead(fileKey: string): string {
    return this.GetSignedUrlForInternalReadService.execute(fileKey);
  }

  async uploadFile(file: Express.Multer.File, fileKey: string): Promise<string | undefined> {
    return this.UploadFileService.execute(file, fileKey);
  }

  async uploadFileFromUrl(fileUrl: string, fileKey: string): Promise<string | undefined> {
    return this.UploadFileFromUrlService.execute(fileUrl, fileKey);
  }

  async getSignedUrlForUpload(
    fileKey: string,
    contentType: string,
    meetingId: string,
    userId: string,
    expiresIn?: number,
  ): Promise<string> {
    return this.GetPutObjectUrlService.execute(fileKey, contentType, meetingId, userId, expiresIn);
  }

  getFileKey(fileUrl: string): string {
    return this.UploadFileFromUrlService.getFileKey(fileUrl);
  }

  getFileUrl(fileKey: string): string {
    return this.UploadFileFromUrlService.getFileUrl(fileKey);
  }
}
