export interface SendSmsParams {
  phoneNumber: string;
  message: string;
}

export interface PublishToTopicParams {
  topicArn: string;
  message: string;
  subject?: string;
  attributes?: Record<string, string>;
}

export interface CreateTopicParams {
  name: string;
}

export interface SubscribeParams {
  topicArn: string;
  protocol: 'email' | 'sms' | 'https' | 'lambda' | 'sqs';
  endpoint: string;
}
