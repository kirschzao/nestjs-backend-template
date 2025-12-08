import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ExceptionInternalCode } from '@/infrastructure/Exceptions/exceptions.types';

export interface ExceptionParams {
  message: string;
  internalKey?: ExceptionInternalCode;
}

export abstract class ExceptionsAdapter {
  abstract badRequest(params: ExceptionParams): BadRequestException;
  abstract conflict(params: ExceptionParams): ConflictException;
  abstract unauthorized(params: ExceptionParams): UnauthorizedException;
  abstract forbidden(params: ExceptionParams): ForbiddenException;
  abstract notFound(params: ExceptionParams): NotFoundException;
  abstract internalServerError(params: ExceptionParams): InternalServerErrorException;
}
