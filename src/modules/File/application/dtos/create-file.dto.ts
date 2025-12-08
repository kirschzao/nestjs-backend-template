import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsNotEmpty, Validate, IsOptional } from 'class-validator';
import { FileTypeValidator } from '@/modules/File/application/dtos/file.type.validator';
import { Transform } from 'class-transformer';

export function ConvertToCreateFileDTO(files: Express.Multer.File): CreateFileDTO {
  const createFileDto = new CreateFileDTO();
  createFileDto.file = files;
  createFileDto.name = files.originalname;
  createFileDto.size = Math.ceil(files.size / (1024 * 1024));
  createFileDto.type = files.mimetype;
  return createFileDto;
}

export class CreateFileDTO {
  @ApiProperty({
    required: true,
    description: 'File (Word, Excel, MP3 ou MP4)',
    type: 'string',
    format: 'binary',
  })
  @Validate(FileTypeValidator, [
    'application/msword', // .doc
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
    'application/vnd.ms-excel', // .xls
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
    'application/pdf', // .pdf
    'application/zip', // .zip
    'application/x-zip-compressed', // .zip
    'image/jpeg', // .jpg, .jpeg
    'image/png', // .png
    'image/gif', // .gif
    'audio/mpeg', // .mp3
    'audio/wav', // .wav
    'audio/ogg', // .ogg
    'audio/aac', // .aac
    'audio/flac', // .flac
    'audio/mp4', // .m4a
    'audio/x-caf', // .caf (Core Audio Format used by iPhone)
    'audio/3gpp', // .3gp audio
    'video/3gpp', // .3gp video
    'video/x-m4v', // .m4v
    'video/mp4', // .mp4
    'video/webm', // .webm
    'video/quicktime', // .mov
    'video/x-msvideo', // .avi
    'video/mpeg', // .mpeg
    'text/plain', // .txt
    'text/csv', // .csv
  ])
  @IsNotEmpty()
  file: Express.Multer.File;

  @ApiProperty({
    description: 'File name',
    example: 'relatorio_mensal.xlsx',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'File size in mb',
    example: 34000,
    required: true,
  })
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  @IsNotEmpty()
  size: number;

  @ApiProperty({
    description: 'File type',
    example: '.pdf',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({
    description: 'Message ID',
    example: '1234567890abcdef12345678',
    required: true,
  })
  @IsString()
  @IsOptional()
  messageId: string;
}
