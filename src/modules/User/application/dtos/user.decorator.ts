import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UpdateUserDTO } from './update-user.dto';
import { CreateUserDTO } from './create-user.dto';
import { UserExceptions } from '@/infrastructure/Exceptions/exceptions.types';

export const CreateUserDecorator = applyDecorators(
  ApiOperation({
    summary: 'Create a new user',
    description: 'This endpoint allows you to create a new user in the system.',
  }),
  ApiCreatedResponse({
    description: 'User created successfully.',
    type: CreateUserDTO,
  }),
  ApiBadRequestResponse({
    description: 'Bad request. The input data is invalid or missing.',
  }),
  ApiInternalServerErrorResponse({
    description:
      'Internal server error. An unexpected error occurred while processing the request.',
  }),
);

export const UpdateUserDecorator = applyDecorators(
  ApiOperation({
    summary: 'Update an existing user',
    description: 'This endpoint allows you to update an existing user in the system.',
  }),
  ApiOkResponse({
    description: 'User updated successfully.',
    type: UpdateUserDTO,
  }),
  ApiNotFoundResponse({
    description: 'User not found. The user with the specified ID does not exist.',
  }),
  ApiBadRequestResponse({
    description: 'Bad request. The input data is invalid or missing.',
  }),
  ApiInternalServerErrorResponse({
    description:
      'Internal server error. An unexpected error occurred while processing the request.',
  }),
);

export const GetAllUsersDecorator = applyDecorators(
  ApiOperation({
    summary: 'List all users',
    description: 'This endpoint retrieves a list of all users in the system.',
  }),
  ApiOkResponse({
    description: 'List of users retrieved successfully.',
  }),
  ApiNotFoundResponse({
    description: 'No users found. The system does not contain any users.',
  }),
  ApiInternalServerErrorResponse({
    description:
      'Internal server error. An unexpected error occurred while processing the request.',
  }),
);

export const GetUserDecorator = applyDecorators(
  ApiOperation({
    summary: 'Get a user by ID',
    description: 'This endpoint retrieves a user by their unique ID.',
  }),
  ApiOkResponse({
    description: 'User retrieved successfully.',
  }),
  ApiNotFoundResponse({
    description: 'User not found. The user with the specified ID does not exist.',
  }),
  ApiInternalServerErrorResponse({
    description:
      'Internal server error. An unexpected error occurred while processing the request.',
  }),
);

export const GetUserWithAccountDecorator = applyDecorators(
  ApiOperation({
    summary: 'Get a user with account information by ID',
    description:
      'This endpoint retrieves a user along with their account information by their unique ID.',
  }),
  ApiOkResponse({
    description: 'User with account information retrieved successfully.',
  }),
  ApiNotFoundResponse({
    description: 'User not found. The user with the specified ID does not exist.',
  }),
  ApiInternalServerErrorResponse({
    description:
      'Internal server error. An unexpected error occurred while processing the request.',
  }),
);

export const DeleteUserDecorator = applyDecorators(
  ApiOperation({
    summary: 'Delete a user',
    description: 'This endpoint allows you to delete a user from the system.',
  }),
  ApiOkResponse({
    description: 'User deleted successfully.',
    schema: { type: 'boolean' },
  }),
  ApiNotFoundResponse({
    description: 'User not found. The user with the specified ID does not exist.',
    schema: {
      example: {
        message: 'User not found with the provided ID',
        internalKey: UserExceptions.USER_NOT_FOUND,
      },
    },
  }),
  ApiUnauthorizedResponse({
    description: 'Unauthorized. Invalid authentication credentials provided.',
    schema: {
      example: {
        message: 'Invalid password provided',
        internalKey: UserExceptions.USER_INVALID_PASSWORD,
      },
    },
  }),
  ApiForbiddenResponse({
    description: 'Forbidden. You do not have permission to delete this user.',
    schema: {
      example: {
        message: "User doesn't have permission",
        internalKey: UserExceptions.USER_NOT_ALLOWED,
      },
    },
  }),
  ApiInternalServerErrorResponse({
    description:
      'Internal server error. An unexpected error occurred while processing the request.',
  }),
);

export const DeleteUserPhoneDecorator = applyDecorators(
  ApiOperation({
    summary: 'Delete a user phone',
    description: 'This endpoint allows you to delete a user phone from the system.',
  }),
  ApiOkResponse({
    description: 'User phone deleted successfully.',
  }),
  ApiInternalServerErrorResponse({
    description:
      'Internal server error. An unexpected error occurred while processing the request.',
  }),
);
