import { applyDecorators } from '@nestjs/common';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import {
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
  ApiProperty,
  ApiNotFoundResponse,
} from '@nestjs/swagger';

export class LoginRequestDTO {
  @ApiProperty({
    description: 'User email',
    example: 'guilhermecassol@gmail.com',
    required: true,
  })
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'Cassolzinho123',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}

export const LoginDecorator = applyDecorators(
  ApiOperation({
    summary: 'User login',
    description: 'This endpoint allows a user to log in to the system.',
  }),
  ApiUnauthorizedResponse({
    description: 'Unauthorized. The provided credentials are invalid.',
  }),
  ApiInternalServerErrorResponse({
    description:
      'Internal server error. An unexpected error occurred while processing the request.',
  }),
);

export const LogoutDecorator = applyDecorators(
  ApiOperation({
    summary: 'User logout',
    description: 'This endpoint allows a user to log out from the system.',
  }),
  ApiUnauthorizedResponse({
    description: 'Unauthorized. The user is not authenticated.',
  }),
  ApiInternalServerErrorResponse({
    description:
      'Internal server error. An unexpected error occurred while processing the request.',
  }),
);

export const RefreshTokenDecorator = applyDecorators(
  ApiOperation({
    summary: 'Refresh access token',
    description:
      'This endpoint allows a user to refresh their access token using a valid refresh token.',
  }),
  ApiNotFoundResponse({
    description: 'User not found. The user associated with the refresh token does not exist.',
  }),
  ApiUnauthorizedResponse({
    description: 'Unauthorized. The provided refresh token is invalid or expired.',
  }),
  ApiInternalServerErrorResponse({
    description:
      'Internal server error. An unexpected error occurred while processing the request.',
  }),
);
