import { File } from './file.entity';
import { FileInterface } from '@/modules/File/domain/file.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class FileRepository {
  abstract createFile(file: File): Promise<File>;
  abstract getFileById(id: string): Promise<File | null>;
  abstract getFileByFileUrl(fileUrl: string): Promise<File | null>;
  abstract getFilesByAuthorId(authorId: string): Promise<File[]>;
  abstract getFilesByAuthorIdInKnowledge(authorId: string): Promise<File[]>;
  abstract updateFile(file: FileInterface, id: string): Promise<File>;
  abstract deleteFile(id: string): Promise<void | boolean>;
}
