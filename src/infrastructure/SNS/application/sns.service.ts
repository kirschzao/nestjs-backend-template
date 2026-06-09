import { Injectable } from '@nestjs/common';
import { SNSAdapter } from '@/infrastructure/SNS/sns.adapter';
import {
  SendSmsParams,
  PublishToTopicParams,
  CreateTopicParams,
  SubscribeParams,
} from '@/infrastructure/SNS/sns.types';
import { SendSmsService } from './send-sms.service';
import { PublishToTopicService } from './publish-to-topic.service';
import { CreateTopicService } from './create-topic.service';
import { SubscribeTopicService } from './subscribe-topic.service';
import { UnsubscribeTopicService } from './unsubscribe-topic.service';

@Injectable()
export class SNSService implements SNSAdapter {
  constructor(
    private readonly SendSmsService: SendSmsService,
    private readonly PublishToTopicService: PublishToTopicService,
    private readonly CreateTopicService: CreateTopicService,
    private readonly SubscribeTopicService: SubscribeTopicService,
    private readonly UnsubscribeTopicService: UnsubscribeTopicService,
  ) {}

  async sendSms(params: SendSmsParams): Promise<void> {
    return this.SendSmsService.execute(params);
  }

  async publishToTopic(params: PublishToTopicParams): Promise<string | undefined> {
    return this.PublishToTopicService.execute(params);
  }

  async createTopic(params: CreateTopicParams): Promise<string | undefined> {
    return this.CreateTopicService.execute(params);
  }

  async subscribe(params: SubscribeParams): Promise<string | undefined> {
    return this.SubscribeTopicService.execute(params);
  }

  async unsubscribe(subscriptionArn: string): Promise<void> {
    return this.UnsubscribeTopicService.execute(subscriptionArn);
  }
}
