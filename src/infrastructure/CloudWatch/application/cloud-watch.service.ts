import { Injectable } from '@nestjs/common';
import { CloudWatchAdapter } from '@/infrastructure/CloudWatch/cloud-watch.adapter';
import { CloudWatchLogParams } from '@/infrastructure/CloudWatch/cloud-watch.types';
import { PutLogEventService } from './put-log-event.service';

@Injectable()
export class CloudWatchService implements CloudWatchAdapter {
  constructor(private readonly PutLogEventService: PutLogEventService) {}

  async log(params: CloudWatchLogParams): Promise<void> {
    const message = JSON.stringify({
      level: params.level,
      message: params.message,
      context: params.context,
      data: params.data,
    });

    await this.PutLogEventService.execute(
      params.logGroupName,
      params.logStreamName,
      [{ timestamp: Date.now(), message }],
    );
  }
}
