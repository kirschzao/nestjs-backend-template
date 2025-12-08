import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import * as ms from 'ms';
import { StringValue } from 'ms';
import { Env } from '@/global/env.schema';
import { CookiesAdapter } from '@/infrastructure/Cookies/cookies.adapter';
import { CookieOptions } from 'express-serve-static-core';

@Injectable()
export class SetAuthCookiesService {
  constructor(
    private readonly ConfigService: ConfigService<Env, true>,
    @Inject(CookiesAdapter)
    private readonly CookiesAdapter: CookiesAdapter,
  ) {}

  public execute(res: Response, userId: string, refreshToken: string): void {
    const expireInString = this.ConfigService.get<string>('REFRESH_TOKEN_EXPIRATION');
    const expireInMs = ms(expireInString as StringValue);
    const cfCookieDomain = this.ConfigService.get<string>('CLOUDFRONT_COOKIE_BASE_DOMAIN');

    const isDeployed =
      this.ConfigService.get<string>('NODE_ENV') === 'production' ||
      this.ConfigService.get<string>('NODE_ENV') === 'stage';

    res.cookie('refreshToken', refreshToken, {
      httpOnly: isDeployed,
      secure: isDeployed,
      sameSite: 'lax',
      maxAge: expireInMs,
      path: '/',
    });

    const signedCookies = this.CookiesAdapter.generateSignedCookies(userId);

    const cfCookieOptions: CookieOptions = {
      httpOnly: true,
      secure: isDeployed,
      sameSite: 'lax',
      domain: cfCookieDomain,
      path: '/',
      maxAge: expireInMs,
    };

    res.cookie('CloudFront-Policy', signedCookies.policy, cfCookieOptions);
    res.cookie('CloudFront-Signature', signedCookies.signature, cfCookieOptions);
    res.cookie('CloudFront-Key-Pair-Id', signedCookies.keyPairId, cfCookieOptions);
  }
}
