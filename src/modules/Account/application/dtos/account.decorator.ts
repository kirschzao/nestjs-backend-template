import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';

export const UpdateAccountDecorator = applyDecorators(
  ApiOperation({
    summary: 'Update a account',
    description: 'This endpoint allows you to update account information.',
  }),
  ApiOkResponse({
    description: 'Account updated successfully.',
  }),
  ApiBadRequestResponse({
    description: 'Bad request. The provided data is invalid or incomplete.',
  }),
  ApiNotFoundResponse({
    description: 'Account not found. The account with the specified ID does not exist.',
  }),
  ApiInternalServerErrorResponse({
    description:
      'Internal server error. An unexpected error occurred while processing the request.',
  }),
);

export const GetAllAccountsDecorator = applyDecorators(
  ApiOperation({
    summary: 'List all accounts',
    description: 'This endpoint retrieves a list of all accounts in the system.',
  }),
  ApiOkResponse({
    description: 'Accounts retrieved successfully.',
  }),
  ApiInternalServerErrorResponse({
    description:
      'Internal server error. An unexpected error occurred while processing the request.',
  }),
);

export const GetAccountDecorator = applyDecorators(
  ApiOperation({
    summary: 'Get account by ID',
    description: 'This endpoint retrieves account details by its ID.',
  }),
  ApiOkResponse({
    description: 'Account retrieved successfully.',
  }),
  ApiNotFoundResponse({
    description: 'Account not found. The account with the specified ID does not exist.',
  }),
  ApiInternalServerErrorResponse({
    description:
      'Internal server error. An unexpected error occurred while processing the request.',
  }),
);




export const DeleteAccountDecorator = applyDecorators(
  ApiOperation({
    summary: 'Delete account by ID',
    description: 'This endpoint deletes an account by its ID.',
  }),
  ApiOkResponse({
    description: 'Account deleted successfully.',
  }),
  ApiNotFoundResponse({
    description: 'Account not found. The account with the specified ID does not exist.',
  }),
  ApiInternalServerErrorResponse({
    description:
      'Internal server error. An unexpected error occurred while processing the request.',
  }),
);
