import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/global/common/guards/jwt-auth.guard';
import { GetUser } from '@/global/common/decorators/get-user.decorator';
import { DeleteAccountService } from '@/modules/Account/application/services/delete-account.service';
import { GetAllAccountsService } from '@/modules/Account/application/services/get-all-accounts.service';
import { GetAccountByIdService } from '@/modules/Account/application/services/get-account-by-id.service';
import {
  GetAllAccountsDecorator,
  GetAccountDecorator,
  DeleteAccountDecorator,
} from '@/modules/Account/application/dtos/account.decorator';
import { IsAdmin } from '@/global/common/decorators/is-admin-decorator';

@Controller('account')
@UseGuards(JwtAuthGuard)
@ApiTags('Account')
export class AccountController {
  constructor(
    private readonly GetAllAccountService: GetAllAccountsService,
    private readonly GetAccount: GetAccountByIdService,
    private readonly DeleteAccountService: DeleteAccountService,
  ) {}

  @GetAccountDecorator
  @Get(':id')
  async getAccountById(@Param('id') id: string) {
    return await this.GetAccount.execute(id);
  }

  @GetAllAccountsDecorator
  @IsAdmin()
  @Get()
  async getAllAccounts() {
    return await this.GetAllAccountService.execute();
  }

  @DeleteAccountDecorator
  @Delete(':id')
  async deleteAccount(@Param('id') id: string, @GetUser() user) {
    return await this.DeleteAccountService.execute(String(user.id));
  }
}
