import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { applyDecorators } from '@nestjs/common';
import {
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export class ValidateResetPasswordDTO {
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
}

export const ValidateResetPasswordDecorator = applyDecorators(
  ApiOperation({
    summary: 'Validate Reset Password',
    description: 'This endpoint allows a user to validate the reset password token.',
  }),
  ApiUnauthorizedResponse({
    description: 'Unauthorized. The provided credentials are invalid.',
  }),
  ApiInternalServerErrorResponse({
    description:
      'Internal server error. An unexpected error occurred while processing the request.',
  }),
);
