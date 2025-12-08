import { Global, Module } from '@nestjs/common';
import { AccountController } from '@/modules/Account/infra/presentation/account.controller';
import { CreateAccountService } from '@/modules/Account/application/services/create-account.service';
import { DeleteAccountService } from '@/modules/Account/application/services/delete-account.service';
import { GetAccountByIdService } from '@/modules/Account/application/services/get-account-by-id.service';
import { GetAllAccountsService } from '@/modules/Account/application/services/get-all-accounts.service';
import { UpdateSignatureAccountService } from '@/modules/Account/application/services/update-signature-account.service';
import { UpdateMeetingTimeAccountService } from '@/modules/Account/application/services/update-meeting-seconds.service';
import { UpdateStorageUsedAccountService } from '@/modules/Account/application/services/update-storage-used.service';
import { UpdateTokensUsedAccountService } from '@/modules/Account/application/services/update-tokens-used.service';
import { VerifyAndUpdateAccountStatusesService } from '@/modules/Account/application/services/verify-all-account-status.service';
import { GetCurrentSignatureByAccountId } from '@/modules/Account/application/services/get-current-signature-account.service';
import { ProductModule } from '@/modules/Product/product.module';

@Global()
@Module({
  imports: [ProductModule],
  controllers: [AccountController],
  providers: [
    CreateAccountService,
    GetAllAccountsService,
    GetAccountByIdService,
    DeleteAccountService,
    UpdateSignatureAccountService,
    UpdateMeetingTimeAccountService,
    UpdateStorageUsedAccountService,
    UpdateTokensUsedAccountService,
    VerifyAndUpdateAccountStatusesService,
    GetCurrentSignatureByAccountId,
  ],
  exports: [
    UpdateMeetingTimeAccountService,
    UpdateStorageUsedAccountService,
    UpdateTokensUsedAccountService,
    VerifyAndUpdateAccountStatusesService,
  ],
})
export class AccountModule {}
