import { Injectable } from '@nestjs/common';
import { FileRepository } from '@/modules/File/domain/file.repository';
import { BucketAdapter } from '@/infrastructure/Bucket/bucket.adapter';
import { ExceptionsAdapter } from '@/infrastructure/Exceptions/exceptions.adapter';
import { File } from '@/modules/File/domain/file.entity';
import { UserRepository } from '@/modules/User/domain/user.repository';
import { UserExceptions } from '@/infrastructure/Exceptions/exceptions.types';

@Injectable()
export class GetFilesByAuthorIdService {
  constructor(
    private readonly fileRepository: FileRepository,
    private readonly userRepository: UserRepository,
    private readonly bucketAdapter: BucketAdapter,
    private readonly exception: ExceptionsAdapter,
  ) {}

  async execute(authorId: string, userId: string): Promise<File[] | void> {
    if (authorId !== userId) {
      throw this.exception.forbidden({
        message: "User doesn't have permission",
        internalKey: UserExceptions.USER_NOT_ALLOWED,
      });
    }
    const author = await this.userRepository.findUserById(authorId);
    if (!author) {
      throw this.exception.notFound({
        message: 'Author not found',
        internalKey: UserExceptions.USER_NOT_ALLOWED,
      });
    }
    const files = await this.fileRepository.getFilesByAuthorId(authorId);
    const filteredFiles = files.filter((file) => !file.deleted);

    filteredFiles.forEach((file) => {
      if (file.fileUrl) {
        file.fileUrl = this.bucketAdapter.getSignedUrlForInternalRead(file.fileUrl);
      }
    });

    return filteredFiles;
  }
}
