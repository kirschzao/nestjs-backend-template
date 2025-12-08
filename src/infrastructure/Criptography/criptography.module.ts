import { Module } from '@nestjs/common';
import { CryptographyAdapter } from '@/infrastructure/Criptography/cryptography.adapter';
import { CryptographyIntegration } from '@/infrastructure/Criptography/services/cryptography.integration';

@Module({
  providers: [
    {
      provide: CryptographyAdapter,
      useClass: CryptographyIntegration,
    },
  ],
  exports: [CryptographyAdapter],
})
export class CryptographyModule {}
