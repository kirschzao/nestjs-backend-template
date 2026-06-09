import { Module, Global } from '@nestjs/common';
import { CloudWatchAdapter } from './cloud-watch.adapter';
import { CloudWatchService } from './application/cloud-watch.service';
import { CloudWatchHelperIntegration } from './application/cloud-watch-helper-integration';
import { PutLogEventService } from './application/put-log-event.service';

@Global()
@Module({
  providers: [
    CloudWatchHelperIntegration,
    PutLogEventService,
    {
      provide: CloudWatchAdapter,
      useClass: CloudWatchService,
    },
  ],
  exports: [CloudWatchAdapter],
})
export class CloudWatchModule {}
