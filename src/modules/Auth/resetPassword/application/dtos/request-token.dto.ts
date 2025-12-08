import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { applyDecorators } from '@nestjs/common';
import {
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export class ResetPasswordRequestDTO {
  @ApiProperty({
    description: 'User email',
    example: 'guilhermecassol@gmail.com',
    required: true,
  })
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;
}

export const ResetPasswordRequestDecorator = applyDecorators(
  ApiOperation({
    summary: 'User reset password',
    description: 'This endpoint allows a user to request a password reset.',
  }),
  ApiUnauthorizedResponse({
    description: 'Unauthorized. The provided credentials are invalid.',
  }),
  ApiInternalServerErrorResponse({
    description:
      'Internal server error. An unexpected error occurred while processing the request.',
  }),
);
