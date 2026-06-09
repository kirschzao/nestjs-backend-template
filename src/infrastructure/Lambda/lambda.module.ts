import { Module, Global } from '@nestjs/common';
import { LambdaAdapter } from './lambda.adapter';
import { LambdaService } from './application/lambda.service';
import { LambdaHelperIntegration } from './application/lambda-helper-integration';
import { InvokeLambdaService } from './application/invoke-lambda.service';
import { InvokeLambdaAsyncService } from './application/invoke-lambda-async.service';

@Global()
@Module({
  providers: [
    LambdaHelperIntegration,
    InvokeLambdaService,
    InvokeLambdaAsyncService,
    {
      provide: LambdaAdapter,
      useClass: LambdaService,
    },
  ],
  exports: [LambdaAdapter],
})
export class LambdaModule {}
