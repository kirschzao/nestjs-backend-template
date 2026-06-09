import { Module, Global } from '@nestjs/common';
import { SecretsAdapter } from './secrets.adapter';
import { SecretsService } from './application/secrets.service';
import { SecretsHelperIntegration } from './application/secrets-helper-integration';
import { GetSecretService } from './application/get-secret.service';
import { CreateSecretService } from './application/create-secret.service';
import { UpdateSecretService } from './application/update-secret.service';
import { DeleteSecretService } from './application/delete-secret.service';

@Global()
@Module({
  providers: [
    SecretsHelperIntegration,
    GetSecretService,
    CreateSecretService,
    UpdateSecretService,
    DeleteSecretService,
    {
      provide: SecretsAdapter,
      useClass: SecretsService,
    },
  ],
  exports: [SecretsAdapter],
})
export class SecretsModule {}
