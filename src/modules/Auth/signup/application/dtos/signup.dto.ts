import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { applyDecorators } from '@nestjs/common';
import {
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export class SignupRequestDTO {
  @ApiProperty({
    description: 'User email',
    example: 'erickcarpes@gmail.com',
    required: true,
  })
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'User name',
    example: 'Erick Carpes',
    required: true,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'User password',
    example: 'ErickCarpes123*',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}

export const SignupDecorator = applyDecorators(
  ApiOperation({
    summary: 'User signup',
    description: 'This endpoint allows a user to sign in to the system.',
  }),
  ApiUnauthorizedResponse({
    description: 'Unauthorized. The provided credentials are invalid.',
  }),
  ApiInternalServerErrorResponse({
    description:
      'Internal server error. An unexpected error occurred while processing the request.',
  }),
);
