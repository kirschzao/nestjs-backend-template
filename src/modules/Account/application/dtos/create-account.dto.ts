import { AccountStatus, AccountTier } from '@/modules/Account/domain/account.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateAccountDTO {
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
