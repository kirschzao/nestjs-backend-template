import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { Env } from '@/global/env.schema';
import { CookieOptions } from 'express-serve-static-core';

@Injectable()
export class ClearAuthCookiesService {
  constructor(private readonly ConfigService: ConfigService<Env, true>) {}

  public execute(res: Response): void {
    const cfCookieDomain = this.ConfigService.get<string>('CLOUDFRONT_COOKIE_BASE_DOMAIN');

    const isDeployed =
      this.ConfigService.get<string>('NODE_ENV') === 'production' ||
      this.ConfigService.get<string>('NODE_ENV') === 'stage';

    res.clearCookie('refreshToken', {
      httpOnly: isDeployed,
      secure: isDeployed,
      sameSite: 'lax',
      path: '/',
    });

    const cfCookieOptions: CookieOptions = {
      expires: new Date(0),
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      domain: cfCookieDomain,
    };

    res.cookie('CloudFront-Policy', '', cfCookieOptions);
    res.cookie('CloudFront-Signature', '', cfCookieOptions);
    res.cookie('CloudFront-Key-Pair-Id', '', cfCookieOptions);
  }
}
