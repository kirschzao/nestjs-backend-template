export type CloudWatchLogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';

export interface CloudWatchLogParams {
  logGroupName: string;
  logStreamName: string;
  level: CloudWatchLogLevel;
  message: string;
  context?: string;
  data?: Record<string, unknown>;
}

export interface CloudWatchLogEvent {
  timestamp: number;
  message: string;
}
