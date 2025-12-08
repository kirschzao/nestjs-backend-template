import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { applyDecorators } from '@nestjs/common';
import {
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export class ResetPasswordDTO {
  @ApiProperty({
    description: 'Token id',
    example: 'ivyuuzwcpdbblxmyplhx2tnh',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  tokenId: string;

  @ApiProperty({
    description: 'Indicates if the token has 4 digits',
    example: '1234',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  token: string;

  @ApiProperty({
    description: 'New password for the user',
    example: 'StrongP@ssw0rd!',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  newPassword: string;
}

export const ResetPasswordDecorator = applyDecorators(
  ApiOperation({
    summary: 'Reset Password',
    description: 'This endpoint allows a user to reset password token.',
  }),
  ApiUnauthorizedResponse({
    description: 'Unauthorized. The provided credentials are invalid.',
  }),
  ApiInternalServerErrorResponse({
    description:
      'Internal server error. An unexpected error occurred while processing the request.',
  }),
);
