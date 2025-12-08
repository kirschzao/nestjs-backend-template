import {
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
  InternalServerErrorException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { ExceptionParams, ExceptionsAdapter } from '@/infrastructure/Exceptions/exceptions.adapter';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ExceptionsIntegration implements ExceptionsAdapter {
  private readonly logger = new Logger('API Exceptions');

  badRequest(data: ExceptionParams): BadRequestException {
    this.logger.warn(`Bad Request: ${data.message} - Internal Key: ${data.internalKey || 'N/A'}`);
    return new BadRequestException(data);
  }

  conflict(data: ExceptionParams): ConflictException {
    this.logger.warn(`Conflict: ${data.message} - Internal Key: ${data.internalKey || 'N/A'}`);
    return new ConflictException(data);
  }

  unauthorized(data: ExceptionParams): UnauthorizedException {
    this.logger.warn(`Unauthorized: ${data.message} - Internal Key: ${data.internalKey || 'N/A'}`);
    return new UnauthorizedException(data);
  }

  forbidden(data: ExceptionParams): ForbiddenException {
    this.logger.warn(`Forbidden: ${data.message} - Internal Key: ${data.internalKey || 'N/A'}`);
    return new ForbiddenException(data);
  }

  notFound(data: ExceptionParams): NotFoundException {
    this.logger.warn(`Not Found: ${data.message} - Internal Key: ${data.internalKey || 'N/A'}`);
    return new NotFoundException(data);
  }

  internalServerError(data: ExceptionParams): InternalServerErrorException {
    this.logger.error(
      `Internal Server Error: ${data.message} - Internal Key: ${data.internalKey || 'N/A'}`,
    );
    return new InternalServerErrorException(data);
  }
}
