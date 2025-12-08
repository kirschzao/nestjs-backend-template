import { Module } from '@nestjs/common';
import { FileController } from '@/modules/File/infra/presentation/file.controller';
import { CreateFileService } from '@/modules/File//application/services/create-file.service';
import { GetFileByIdService } from '@/modules/File//application/services/get-file-by-id.service';
import { GetFilesByAuthorIdService } from '@/modules/File//application/services/get-file-by-author-id.service';
import { UpdateFileService } from '@/modules/File//application/services/update-file.service';
import { DeleteFileService } from '@/modules/File//application/services/delete-file.service';

@Module({
  imports: [],
  controllers: [FileController],
  providers: [
    CreateFileService,
    GetFileByIdService,
    GetFilesByAuthorIdService,
    UpdateFileService,
    DeleteFileService,
  ],
  exports: [CreateFileService, GetFileByIdService, GetFilesByAuthorIdService, UpdateFileService],
})
export class FileModule {}
