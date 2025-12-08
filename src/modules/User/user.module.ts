import { Global, Module } from '@nestjs/common';
import { UserController } from '@/modules/User/infra/presentation/user.controller';
import { CreateUserService } from '@/modules/User/application/services/create-user.service';
import { UpdateUserService } from '@/modules/User/application/services/update-user.service';
import { GetAllUserService } from '@/modules/User/application/services/get-all-user.service';
import { GetUserByIdService } from '@/modules/User/application/services/get-user.service';
import { DeleteUserService } from '@/modules/User/application/services/delete-user.service';
import { CryptographyModule } from '@/infrastructure/Criptography/criptography.module';
import { GetUserWithAccountService } from '@/modules/User/application/services/get-user-with-account.service';
import { DeleteUserPhoneService } from '@/modules/User/application/services/delete-user-phone.service';

@Global()
@Module({
  imports: [CryptographyModule],
  controllers: [UserController],
  providers: [
    CreateUserService,
    UpdateUserService,
    GetAllUserService,
    GetUserByIdService,
    GetUserWithAccountService,
    DeleteUserPhoneService,
    DeleteUserService,
  ],
  exports: [CreateUserService],
})
export class UserModule {}
