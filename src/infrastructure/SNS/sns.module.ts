import { Module, Global } from '@nestjs/common';
import { SNSAdapter } from './sns.adapter';
import { SNSService } from './application/sns.service';
import { SNSHelperIntegration } from './application/sns-helper-integration';
import { SendSmsService } from './application/send-sms.service';
import { PublishToTopicService } from './application/publish-to-topic.service';
import { CreateTopicService } from './application/create-topic.service';
import { SubscribeTopicService } from './application/subscribe-topic.service';
import { UnsubscribeTopicService } from './application/unsubscribe-topic.service';

@Global()
@Module({
  providers: [
    SNSHelperIntegration,
    SendSmsService,
    PublishToTopicService,
    CreateTopicService,
    SubscribeTopicService,
    UnsubscribeTopicService,
    {
      provide: SNSAdapter,
      useClass: SNSService,
    },
  ],
  exports: [SNSAdapter],
})
export class SNSModule {}
