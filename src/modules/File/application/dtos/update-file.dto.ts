import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class UpdateFileDTO {
  @ApiProperty({
    description: 'ID do arquivo',
    example: '1234567890abcdef',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({
    description: 'Nome do arquivo',
    example: 'relatorio_mensal.xlsx',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Tamanho do arquivo em megabytes',
    example: 34000,
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  size: number;

  @ApiProperty({
    description: 'Tipo MIME do arquivo',
    example: '.pdf',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  type: string;
}
