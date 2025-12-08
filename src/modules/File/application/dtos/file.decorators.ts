import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiForbiddenResponse,
  ApiConsumes,
  ApiBody,
  ApiPayloadTooLargeResponse,
} from '@nestjs/swagger';
import { CreateFileDTO } from './create-file.dto';
import { UpdateFileDTO } from './update-file.dto';

const MAX_FILES = 10;
const MAX_FILE_SIZE_MB = 100;

export const CreateFileDecorator = applyDecorators(
  ApiOperation({
    summary: 'Upload a new files',
    description: `This endpoint allows you to upload a new files in the system and atributes to a user. 
      Limits: Up to ${MAX_FILES} files per upload, and each file can have up to ${MAX_FILE_SIZE_MB} MB.`,
  }),
  ApiCreatedResponse({
    description: 'Files successfully uploaded.',
    type: CreateFileDTO,
  }),
  ApiBadRequestResponse({
    description: 'Bad request. The input data is invalid or missing.',
  }),
  ApiInternalServerErrorResponse({
    description:
      'Internal server error. An unexpected error occurred while processing the request.',
  }),
  ApiPayloadTooLargeResponse({
    description: `File size exceeds the maximum size allowed or the quantity of files to be uploaded exceeded: Maximum file sie: ${MAX_FILE_SIZE_MB} | Allowed files quantity: ${MAX_FILES}`,
  }),
  ApiConsumes('multipart/form-data'),
  ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  }),
);

export const CreateFileKnowledgeDecorator = applyDecorators(
  ApiOperation({
    summary: 'Upload a new file in knowledge context',
    description:
      'This endpoint allows you to upload a new file in the system and atributo to a user.',
  }),
  ApiCreatedResponse({
    description: 'File upload successfully.',
    type: CreateFileDTO,
  }),
  ApiBadRequestResponse({
    description: 'Bad request. The input data is invalid or missing.',
  }),
  ApiInternalServerErrorResponse({
    description:
      'Internal server error. An unexpected error occurred while processing the request.',
  }),
  ApiConsumes('multipart/form-data'),
  ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  }),
);

export const DeleteFileDecorator = applyDecorators(
  ApiOperation({
    summary: 'Delete file by ID',
    description: 'This endpoint allows you to delete a file by its ID.',
  }),
  ApiOkResponse({
    description: 'File deleted successfully.',
  }),
  ApiNotFoundResponse({
    description: 'File not found. The specified file does not exist.',
  }),
  ApiInternalServerErrorResponse({
    description:
      'Internal server error. An unexpected error occurred while processing the request.',
  }),
  ApiForbiddenResponse({
    description: 'Forbidden. You cannot delete files for another user.',
  }),
);

export const GetFileByIdDecorator = applyDecorators(
  ApiOperation({
    summary: 'Get file by ID',
    description: 'This endpoint allows you to retrieve a file by its ID.',
  }),
  ApiOkResponse({
    description: 'File updated successfully.',
  }),
  ApiBadRequestResponse({
    description: 'Bad request. The input data is invalid or missing.',
  }),
  ApiNotFoundResponse({
    description: 'File not found. The specified file does not exist.',
  }),
  ApiInternalServerErrorResponse({
    description:
      'Internal server error. An unexpected error occurred while processing the request.',
  }),
);

export const GetFileByIdN8NDecorator = applyDecorators(
  ApiOperation({
    summary: 'Get file by ID for N8N',
    description: 'This endpoint allows you to retrieve a file by its ID.',
  }),
  ApiOkResponse({
    description: 'File updated successfully.',
  }),
  ApiBadRequestResponse({
    description: 'Bad request. The input data is invalid or missing.',
  }),
  ApiNotFoundResponse({
    description: 'File not found. The specified file does not exist.',
  }),
  ApiInternalServerErrorResponse({
    description:
      'Internal server error. An unexpected error occurred while processing the request.',
  }),
);

export const GetFileByAuthorIdDecorator = applyDecorators(
  ApiOperation({
    summary: 'List all files by one user',
    description: 'This endpoint retrieves a list of all files for a user.',
  }),
  ApiOkResponse({
    description: 'List of files retrieved successfully.',
  }),
  ApiNotFoundResponse({
    description: 'No files found. The system does not contain any files.',
  }),
  ApiInternalServerErrorResponse({
    description:
      'Internal server error. An unexpected error occurred while processing the request.',
  }),
);

export const GetFilesByAuthorIdInKnowledgeDecorator = applyDecorators(
  ApiOperation({
    summary: 'List all files by one user on knowledge context',
    description: 'This endpoint retrieves a list of all files for a user.',
  }),
  ApiOkResponse({
    description: 'List of files retrieved successfully.',
  }),
  ApiNotFoundResponse({
    description: 'No files found. The system does not contain any files.',
  }),
  ApiInternalServerErrorResponse({
    description:
      'Internal server error. An unexpected error occurred while processing the request.',
  }),
);

export const UpdateFileDecorator = applyDecorators(
  ApiOperation({
    summary: 'Update file by ID',
    description: 'This endpoint allows you to update a file by its ID.',
  }),
  ApiOkResponse({
    description: 'File updated successfully.',
    type: UpdateFileDTO,
  }),
  ApiBadRequestResponse({
    description: 'Bad request. The input data is invalid or missing.',
  }),
  ApiNotFoundResponse({
    description: 'File not found. The specified file does not exist.',
  }),
  ApiInternalServerErrorResponse({
    description:
      'Internal server error. An unexpected error occurred while processing the request.',
  }),
);
