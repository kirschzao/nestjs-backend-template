import { Injectable } from '@nestjs/common';
import { FileRepository } from '@/modules/File/domain/file.repository';
import { File } from '../../domain/file.entity';
import { CreateFileDTO } from '../dtos/create-file.dto';
import { BucketAdapter } from '@/infrastructure/Bucket/bucket.adapter';
import { UserRepository } from '@/modules/User/domain/user.repository';
import { ExceptionsAdapter } from '@/infrastructure/Exceptions/exceptions.adapter';
import { UserExceptions, FileExceptions } from '@/infrastructure/Exceptions/exceptions.types';
import { TransactionAdapter } from '@/infrastructure/Database/Transaction/transaction.adapter';
import { AccountRepository } from '@/modules/Account/domain/account.repository';
import { LoggerAdapter } from '@/infrastructure/Logger/logger.adapter';

@Injectable()
export class CreateFileService {
  constructor(
    private readonly FileRepository: FileRepository,
    private readonly UserRepository: UserRepository,
    private readonly BucketAdapter: BucketAdapter,
    private readonly Exception: ExceptionsAdapter,
    private readonly AccountRepository: AccountRepository,
    private readonly TransactionAdapter: TransactionAdapter,
    private readonly LoggerAdapter: LoggerAdapter,
  ) {}

  async execute(fileDto: CreateFileDTO, authorId: string): Promise<File> {
    const author = await this.UserRepository.findUserById(authorId);
    if (!author) {
      throw this.Exception.badRequest({
        message: 'Author not found',
        internalKey: UserExceptions.USER_NOT_FOUND,
      });
    }

    const sanitizedFileName = fileDto.name.replace(/\s+/g, '');

    const key = `Users/${author.id}/${Date.now()}-${sanitizedFileName}`;

    try {
      const fileUrl = await this.BucketAdapter.uploadFile(fileDto.file, key);

      if (!fileUrl) {
        throw this.Exception.badRequest({
          message: 'Failed to upload at AWS bucket',
          internalKey: FileExceptions.FILE_UPLOAD_FAILED,
        });
      }

      const file = new File({
        name: fileDto.name,
        size: fileDto.size,
        type: fileDto.type,
        fileUrl: fileUrl,
        authorId: authorId,
        deleted: false,
        messageId: fileDto.messageId,
      });
      const persisteFile = this.TransactionAdapter.transaction(async () => {
        const createdFile = await this.FileRepository.createFile(file);
        if (!createdFile) {
          throw this.Exception.internalServerError({
            message: 'Failed to create file',
            internalKey: FileExceptions.FILE_UPLOAD_FAILED,
          });
        }
        await this.AccountRepository.updateStorageUsedInBytes(authorId, fileDto.size * 1024);

        createdFile.fileUrl = this.BucketAdapter.getSignedUrlForInternalRead(createdFile.fileUrl);

        return createdFile;
      });
      return persisteFile;
    } catch (error) {
      await this.BucketAdapter.deleteFile(key);
      this.LoggerAdapter.error({
        where: 'CreateFileService',
        message: `Error creating file for authorId: ${authorId} with file name: ${fileDto.name}. Error: ${error}`,
      });
      throw this.Exception.internalServerError({
        message: 'File creation failed',
        internalKey: FileExceptions.FILE_UPLOAD_FAILED,
      });
    }
  }
}
