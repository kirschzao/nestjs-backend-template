import { Injectable } from '@nestjs/common';
import { LoggerAdapter, LoggerParams } from '@/infrastructure/Logger/logger.adapter';
import { Logger } from '@nestjs/common';

@Injectable()
export class LoggerIntegration implements LoggerAdapter {
  fatal(params: LoggerParams) {
    const logger = new Logger(params.where);
    logger.error(`FATAL: ${params.message}`);
  }

  error(params: LoggerParams) {
    const logger = new Logger(params.where);
    logger.error(`ERROR: ${params.message}`);
  }

  warn(params: LoggerParams) {
    const logger = new Logger(params.where);
    logger.warn(`WARN: ${params.message}`);
  }

  log(params: LoggerParams) {
    const logger = new Logger(params.where);
    logger.log(`LOG: ${params.message}`);
  }

  debug(params: LoggerParams) {
    const logger = new Logger(params.where);
    logger.debug(`DEBUG: ${params.message}`);
  }

  verbose(params: LoggerParams) {
    const logger = new Logger(params.where);
    logger.verbose(`VERBOSE: ${params.message}`);
  }
}
