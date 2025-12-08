export interface LoggerParams {
  message: string;
  where: string;
}

export abstract class LoggerAdapter {
  abstract fatal(params: LoggerParams);
  abstract error(params: LoggerParams);
  abstract warn(params: LoggerParams);
  abstract log(params: LoggerParams);
  abstract debug(params: LoggerParams);
  abstract verbose(params: LoggerParams);
}
