import { ApiProperty } from '@nestjs/swagger';
import { RoleEnum } from '@/modules/User/domain/user.entity';
import { IsEnum, IsNumberString, IsOptional, IsString, Length } from 'class-validator';

export class UpdateUserDTO {
  @ApiProperty({
    description: 'User name',
    example: 'Guilherme Cassol',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'User CPF',
    example: '12345678901',
    required: false,
  })
  @IsOptional()
  @IsNumberString()
  @Length(11, 11)
  cpf?: string;

  @ApiProperty({
    description: 'User phone',
    example: '51999332029',
    required: false,
  })
  @IsOptional()
  @IsNumberString()
  @Length(11, 11)
  phone?: string;

  @ApiProperty({
    description: 'User role',
    example: RoleEnum.USER,
    required: false,
  })
  @IsOptional()
  @IsEnum(RoleEnum)
  role?: RoleEnum;
}
