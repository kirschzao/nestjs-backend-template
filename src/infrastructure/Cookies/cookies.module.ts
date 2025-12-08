import { Module, Global } from '@nestjs/common';
import { CookiesService } from '@/infrastructure/Cookies/application/cookies.service';
import { CloudfrontHelperIntegration } from '@/infrastructure/Cookies/application/cloudfront-helper-integration';
import { GenerateSignedCookiesService } from '@/infrastructure/Cookies/application/generated-signed-cookies.service';
import { CookiesAdapter } from '@/infrastructure/Cookies/cookies.adapter';

@Global()
@Module({
  imports: [],
  providers: [
    CookiesService,
    CloudfrontHelperIntegration,
    GenerateSignedCookiesService,
    {
      provide: CookiesAdapter,
      useClass: CookiesService,
    },
  ],
  exports: [CookiesAdapter],
})
export class CookiesModule {}
