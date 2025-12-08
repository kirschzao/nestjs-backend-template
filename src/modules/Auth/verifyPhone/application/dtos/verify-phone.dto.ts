import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';
import { applyDecorators } from '@nestjs/common';
import {
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export class VerifyPhoneRequestDTO {
  @ApiProperty({
    description: 'User phone number',
    example: '+1234567890',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber()
  phone: string;
}

export const VerifyPhoneRequestDecorator = applyDecorators(
  ApiOperation({
    summary: 'User phone verification',
    description: 'This endpoint allows a user to verify their phone number.',
  }),
  ApiUnauthorizedResponse({
    description: 'Unauthorized. The provided credentials are invalid.',
  }),
  ApiInternalServerErrorResponse({
    description:
      'Internal server error. An unexpected error occurred while processing the request.',
  }),
);
