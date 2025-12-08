import { Injectable } from '@nestjs/common';
import { FileRepository } from '@/modules/File/domain/file.repository';
import { File } from '../../domain/file.entity';
import { UpdateFileDTO } from '../dtos/update-file.dto';
import { BucketAdapter } from '@/infrastructure/Bucket/bucket.adapter';
import { ExceptionsAdapter } from '@/infrastructure/Exceptions/exceptions.adapter';
import { FileExceptions, UserExceptions } from '@/infrastructure/Exceptions/exceptions.types';

@Injectable()
export class UpdateFileService {
  constructor(
    private readonly FileRepository: FileRepository,
    private readonly BucketAdapter: BucketAdapter,
    private readonly Exception: ExceptionsAdapter,
  ) {}

  async execute(file: UpdateFileDTO, authorId: string): Promise<File | void> {
    const existingFile = await this.FileRepository.getFileById(file.id);
    if (!existingFile) {
      throw this.Exception.notFound({
        message: 'No file found',
        internalKey: FileExceptions.FILE_NOT_FOUND,
      });
    }
    if (existingFile.deleted) {
      throw this.Exception.badRequest({
        message: 'File already deleted',
        internalKey: FileExceptions.FILE_ALREADY_DELETED,
      });
    }
    if (existingFile.authorId !== authorId) {
      throw this.Exception.forbidden({
        message: 'You do not have permission to update this file',
        internalKey: UserExceptions.USER_NOT_ALLOWED,
      });
    }
    const updatedFile = {
      name: file.name,
      size: file.size,
      type: file.type,
      fileUrl: existingFile.fileUrl,
      authorId: existingFile.authorId,
      deleted: existingFile.deleted,
    };

    const fileUrl = await this.FileRepository.updateFile(updatedFile, file.id);

    fileUrl.fileUrl = this.BucketAdapter.getSignedUrlForInternalRead(fileUrl.fileUrl);

    return fileUrl;
  }
}
