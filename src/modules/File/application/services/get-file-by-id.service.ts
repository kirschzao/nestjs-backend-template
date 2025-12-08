import { Injectable } from '@nestjs/common';
import { FileRepository } from '@/modules/File/domain/file.repository';
import { BucketAdapter } from '@/infrastructure/Bucket/bucket.adapter';
import { ExceptionsAdapter } from '@/infrastructure/Exceptions/exceptions.adapter';
import { File } from '@/modules/File/domain/file.entity';
import { FileExceptions, UserExceptions } from '@/infrastructure/Exceptions/exceptions.types';

@Injectable()
export class GetFileByIdService {
  constructor(
    private readonly fileRepository: FileRepository,
    private readonly bucketAdapter: BucketAdapter,
    private readonly exception: ExceptionsAdapter,
  ) {}

  async execute(id: string, userId: string): Promise<File | null> {
    const file = await this.fileRepository.getFileById(id);
    if (!file) {
      throw this.exception.notFound({
        message: 'File not found',
        internalKey: FileExceptions.FILE_NOT_FOUND,
      });
    }
    if (file.deleted) {
      throw this.exception.badRequest({
        message: 'File already deleted',
        internalKey: FileExceptions.FILE_ALREADY_DELETED,
      });
    }
    if (file.authorId !== userId) {
      throw this.exception.forbidden({
        message: "User doesn't have permission",
        internalKey: UserExceptions.USER_NOT_ALLOWED,
      });
    }

    file.fileUrl = this.bucketAdapter.getSignedUrlForInternalRead(file.fileUrl);

    return file;
  }
}
