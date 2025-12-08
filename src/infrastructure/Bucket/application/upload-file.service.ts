import { PutObjectCommand } from '@aws-sdk/client-s3';
import { BucketHelperIntegration } from './bucket-helper-integration';
import { ExceptionsAdapter } from '@/infrastructure/Exceptions/exceptions.adapter';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StorageExceptions } from '@/infrastructure/Exceptions/exceptions.types';
import { LoggerAdapter } from '@/infrastructure/Logger/logger.adapter';
import * as path from 'path';

@Injectable()
@Injectable()
export class UploadFileService extends BucketHelperIntegration {
  constructor(
    readonly configService: ConfigService,
    readonly LoggerAdapter: LoggerAdapter,
    readonly exceptionsAdapter: ExceptionsAdapter,
  ) {
    super(configService, exceptionsAdapter);
  }

  async execute(file: Express.Multer.File, fileKey: string): Promise<string | undefined> {
    const directory = path.posix.dirname(fileKey);
    const originalFilename = path.posix.basename(fileKey);

    const sanitizedFilename = originalFilename
      .normalize('NFD') // Normaliza para separar acentos dos caracteres
      .replace(/[\u0300-\u036f]/g, '') // Remove os acentos
      .replace(/[^\w.-]/g, '-') // Substitui qualquer coisa que não seja letra, número, ponto, hífen ou underscore por um hífen
      .replace(/--+/g, '-') // Remove hífens duplicados
      .toLowerCase(); // Converte para minúsculas

    const finalKey =
      directory && directory !== '.'
        ? path.posix.join(directory, sanitizedFilename)
        : sanitizedFilename;

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: finalKey,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    try {
      const uploadResult = await this.s3Client.send(command);
      if (uploadResult.$metadata.httpStatusCode !== 200) {
        this.exceptionsAdapter.internalServerError({
          message: 'Failed to upload the file to the bucket.',
        });
      }
      return finalKey;
    } catch (error) {
      this.LoggerAdapter.error({
        where: 'UploadFileService',
        message: `Error uploading file with key: ${finalKey} to bucket. Error: ${error}`,
      });
      this.exceptionsAdapter.internalServerError({
        message: 'Internal error while trying to upload the file to the bucket.',
        internalKey: StorageExceptions.STORAGE_UPLOAD_FAILED,
      });
    }
  }
}
