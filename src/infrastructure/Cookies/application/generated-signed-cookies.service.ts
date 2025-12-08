import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';
import { Env } from '@/global/env.schema';
import { CloudfrontHelperIntegration } from '@/infrastructure/Cookies/application/cloudfront-helper-integration';

export interface SignedCookies {
  policy: string;
  signature: string;
  keyPairId: string;
  expires: Date;
}

@Injectable()
export class GenerateSignedCookiesService extends CloudfrontHelperIntegration {
  constructor(configService: ConfigService<Env, true>) {
    super(configService);
  }

  execute(userId: string): SignedCookies {
    const expirationDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const expirationTimestamp = Math.floor(expirationDate.getTime() / 1000);

    const policy = {
      Statement: [
        {
          Resource: `https://${this.cfAssetDomain}/Users/${userId}/*`,
          Condition: {
            DateLessThan: {
              ['AWS:EpochTime']: expirationTimestamp,
            },
          },
        },
      ],
    };

    const policyString = JSON.stringify(policy);
    const policyBase64 = Buffer.from(policyString).toString('base64');
    const cloudFrontPolicy = this.encodeToCloudFrontFormat(policyBase64);
    const signer = crypto.createSign('RSA-SHA1');
    signer.update(policyString);

    const signatureBase64 = signer.sign(this.privateKey, 'base64');
    const cloudFrontSignature = this.encodeToCloudFrontFormat(signatureBase64);

    return {
      policy: cloudFrontPolicy,
      signature: cloudFrontSignature,
      keyPairId: this.keyPairId,
      expires: expirationDate,
    };
  }

  private encodeToCloudFrontFormat(data: string): string {
    return data.replace(/\+/g, '-').replace(/=/g, '_').replace(/\//g, '~');
  }
}
