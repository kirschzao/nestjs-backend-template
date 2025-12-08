import { IsEnum, IsIn, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { RoleEnum } from '@/modules/User/domain/user.entity';
import { AccountStatus } from '@/modules/Account/domain/account.entity';

export class RefreshTokenPayload {
  @IsString()
  @IsNotEmpty()
  sub: string;

  @IsEnum(RoleEnum)
  @IsNotEmpty()
  userRole: RoleEnum;

  @IsIn(['ACTIVE', 'EXPIRED', 'INACTIVE', 'REVOKED'])
  @IsNotEmpty()
  accountStatus: AccountStatus;

  @IsNotEmpty()
  isOnboarded: boolean;

  @IsString()
  @IsNotEmpty()
  refreshToken: string;

  @IsNumber()
  @IsNotEmpty()
  iat: number;

  @IsNumber()
  @IsNotEmpty()
  exp: number;
}
