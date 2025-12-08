import { Global, Module } from '@nestjs/common';
import { AccountController } from '@/modules/Account/infra/presentation/account.controller';
import { CreateAccountService } from '@/modules/Account/application/services/create-account.service';
import { DeleteAccountService } from '@/modules/Account/application/services/delete-account.service';
import { GetAccountByIdService } from '@/modules/Account/application/services/get-account-by-id.service';
import { GetAllAccountsService } from '@/modules/Account/application/services/get-all-accounts.service';

@Global()
@Module({
  imports: [],
  controllers: [AccountController],
  providers: [
    CreateAccountService,
    GetAllAccountsService,
    GetAccountByIdService,
    DeleteAccountService,
  ],
  exports: [],
})
export class AccountModule {}
