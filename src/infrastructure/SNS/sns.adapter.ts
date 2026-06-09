import {
  SendSmsParams,
  PublishToTopicParams,
  CreateTopicParams,
  SubscribeParams,
} from './sns.types';

export abstract class SNSAdapter {
  abstract sendSms(params: SendSmsParams): Promise<void>;
  abstract publishToTopic(params: PublishToTopicParams): Promise<string | undefined>;
  abstract createTopic(params: CreateTopicParams): Promise<string | undefined>;
  abstract subscribe(params: SubscribeParams): Promise<string | undefined>;
  abstract unsubscribe(subscriptionArn: string): Promise<void>;
}
