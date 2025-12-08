import { Injectable } from '@nestjs/common';
import { CookiesAdapter } from '@/infrastructure/Cookies/cookies.adapter';
import { GenerateSignedCookiesService } from '@/infrastructure/Cookies/application/generated-signed-cookies.service';

@Injectable()
export class CookiesService implements CookiesAdapter {
  constructor(private readonly GenerateSignedCookiesService: GenerateSignedCookiesService) {}

  public generateSignedCookies(userId: string) {
    return this.GenerateSignedCookiesService.execute(userId);
  }
}
