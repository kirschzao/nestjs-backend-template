import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UpdateSignatureAccountDTO {
  @ApiProperty({
    description: 'Signature start date',
    example: '2024-01-01T00:00:00.000Z',
    required: false,
  })
  @IsOptional()
  signatureStartDate: Date;

  @ApiProperty({
    description: 'Current signature ID',
    example: 'sig_1234567890',
    required: false,
  })
  @IsOptional()
  currentSignatureId: string;
}
