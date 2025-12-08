import { Injectable } from '@nestjs/common';
import { FileRepository } from '@/modules/File/domain/file.repository';
import { BucketAdapter } from '@/infrastructure/Bucket/bucket.adapter';
import { ExceptionsAdapter } from '@/infrastructure/Exceptions/exceptions.adapter';
import { FileExceptions, UserExceptions } from '@/infrastructure/Exceptions/exceptions.types';
import { TransactionAdapter } from '@/infrastructure/Database/Transaction/transaction.adapter';
import { LoggerAdapter } from '@/infrastructure/Logger/logger.adapter';

@Injectable()
export class DeleteFileService {
  constructor(
    private readonly FileRepository: FileRepository,
    private readonly BucketAdapter: BucketAdapter,
    private readonly Exception: ExceptionsAdapter,
    private readonly LoggerAdapter: LoggerAdapter,
    private readonly TransactionAdapter: TransactionAdapter,
  ) {}

  async execute(id: string, authorId: string): Promise<void | { message: string }> {
    const file = await this.FileRepository.getFileById(id);
    if (!file) {
      return this.Exception.notFound({
        message: 'No file found',
        internalKey: FileExceptions.FILE_NOT_FOUND,
      });
    }
    if (file.deleted) {
      return this.Exception.badRequest({
        message: 'File already deleted',
        internalKey: FileExceptions.FILE_ALREADY_DELETED,
      });
    }

    if (file.authorId !== authorId) {
      return this.Exception.forbidden({
        message: 'You do not have permission to delete this file',
        internalKey: UserExceptions.USER_NOT_ALLOWED,
      });
    }

    return this.TransactionAdapter.transaction(async () => {
      try {
        await this.BucketAdapter.deleteFile(file.fileUrl);
      } catch (error) {
        this.LoggerAdapter.error({
          where: 'DeleteFileService',
          message: `Error deleting file from storage for file ID: ${id}, URL: ${file.fileUrl}. Error: ${error}`,
        });
        throw this.Exception.internalServerError({
          message: 'Failed to delete file from storage',
          internalKey: FileExceptions.FILE_UPLOAD_FAILED,
        });
      }
      await this.FileRepository.deleteFile(id);
      return { message: 'File deleted successfully' };
    });
  }
}
