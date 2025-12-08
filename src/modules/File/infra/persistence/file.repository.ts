import { FileRepository } from '@/modules/File/domain/file.repository';
import { File } from '../../domain/file.entity';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infrastructure/Database/prisma.service';
import { FileMapper } from './file.mapper';

@Injectable()
export class PrismaFileRepository implements FileRepository {
  constructor(private readonly prisma: PrismaService) {}

  public async createFile(file: File): Promise<File> {
    const data = FileMapper.toPersistence(file);
    const createdFile = await this.prisma.file.create({
      data: data,
    });

    return FileMapper.toDomain(createdFile);
  }


  public async getFileById(id: string): Promise<File | null> {
    const file = await this.prisma.file.findUnique({
      where: { id },
    });

    if (!file) {
      return null;
    }

    return FileMapper.toDomain(file);
  }

  public async getFilesByAuthorId(authorId: string): Promise<File[]> {
    const files = await this.prisma.file
      .findMany({
        where: { authorId, deleted: false },
        orderBy: { createdAt: 'desc' },
      })
      .then((files) => files.map((file) => FileMapper.toDomain(file)));

    return files;
  }

  public async getFileByFileUrl(fileUrl: string): Promise<File | null> {
    const file = await this.prisma.file.findFirst({
      where: { fileUrl, deleted: false },
    });

    if (!file) {
      return null;
    }

    return FileMapper.toDomain(file);
  }

  public async getFilesByAuthorIdInKnowledge(authorId: string): Promise<File[]> {
    const files = await this.prisma.file
      .findMany({
        where: {
          authorId,
          deleted: false,
          fileUrl: {
            contains: `Users/${authorId}/Knowledge`,
          },
        },

        orderBy: { createdAt: 'desc' },
      })
      .then((files) => files.map((file) => FileMapper.toDomain(file)));

    return files;
  }

  public async updateFile(file: File, id: string): Promise<File> {
    const data = FileMapper.toPersistence(file);
    const updatedFile = await this.prisma.file.update({
      where: { id },
      data: data,
    });

    return FileMapper.toDomain(updatedFile);
  }

  public async deleteFile(id: string): Promise<void | boolean> {
    await this.prisma.file.update({
      where: { id },
      data: {
        deleted: true,
        deletedAt: new Date(),
      },
    });
    return true;
  }
}
