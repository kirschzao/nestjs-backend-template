import { AccountStatus, AccountTier } from '@/modules/Account/domain/account.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateAccountDTO {
  @ApiProperty({
    description: 'Signature start date',
    example: '2024-01-01T00:00:00.000Z',
    required: false,
  })
  @IsOptional()
  signatureStartDate: Date | null;

  @ApiProperty({
    description: 'Signature end date',
    example: '2024-12-31T23:59:59.000Z',
    required: false,
  })
  @IsOptional()
  signatureEndDate: Date | null;

  @ApiProperty({
    description: 'Current signature ID',
    example: 'sig_1234567890',
    required: false,
  })
  @IsOptional()
  currentSignatureId: string | null;

  @ApiProperty({
    description: 'Account status',
    example: 'Active',
  })
  @IsNotEmpty()
  status: AccountStatus;

  @ApiProperty({
    description: 'Number of tokens used',
    example: 1500,
    required: false,
  })
  @Type(() => Number)
  tokensUsed: number;

  @ApiProperty({
    description: 'Number of meeting seconds used',
    example: 3600,
    required: false,
  })
  @Type(() => Number)
  meetingSecondsUsed: number;

  @ApiProperty({
    description: 'Storage used in bytes',
    example: 104857600,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  storageUsedInBytes?: number;

  @ApiProperty({
    description: 'Account tier',
    example: 'Free',
    required: false,
  })
  @IsOptional()
  accountTier: AccountTier;
}
