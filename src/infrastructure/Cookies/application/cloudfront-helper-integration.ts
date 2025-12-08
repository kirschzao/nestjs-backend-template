import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Env } from '@/global/env.schema';

@Injectable()
export class CloudfrontHelperIntegration {
  public readonly privateKey: string;
  public readonly keyPairId: string;
  public readonly cfCookieDomain: string;
  public readonly cfAssetDomain: string;

  constructor(private configService: ConfigService<Env, true>) {
    const base64Key = this.configService.get<string>('CLOUDFRONT_PRIVATE_KEY');
    this.privateKey = Buffer.from(base64Key, 'base64').toString('utf8');
    this.keyPairId = this.configService.get<string>('CLOUDFRONT_KEY_PAIR_ID');

    this.cfCookieDomain = this.configService.get<string>('CLOUDFRONT_COOKIE_BASE_DOMAIN');

    this.cfAssetDomain = this.configService.get<string>('CLOUDFRONT_ASSET_DOMAIN');
  }
}
