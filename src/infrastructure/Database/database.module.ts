import { Global, Module } from '@nestjs/common';
import { RefreshTokenRepository } from '@/modules/Auth/login/domain/refresh-token.repository';
import { UserRepository } from '@/modules/User/domain/user.repository';
import { PrismaUserRepository } from '@/modules/User/infra/persistence/user.repository';
import { PrismaService } from '@/infrastructure/Database/prisma.service';
import { PrismaRefreshTokenRepository } from '@/modules/Auth/login/infra/persistence/refresh-token.repository';
import { FileRepository } from '@/modules/File/domain/file.repository';
import { PrismaFileRepository } from '@/modules/File/infra/persistence/file.repository';
import { BucketModule } from '../Bucket/bucket.module';
import { Token2FARepository } from '@/modules/Auth/signup/domain/2fa-token.repository';
import { PrismaToken2FaRepository } from '@/modules/Auth/signup/infra/persistence/2fa-token.repository';
import { ResetPasswordTokenRepository } from '@/modules/Auth/resetPassword/domain/reset-password-token.repository';
import { PrismaResetPasswordTokenRepository } from '@/modules/Auth/resetPassword/infra/persistence/reset-passaword-token.repository';
import { TransactionAdapter } from './Transaction/transaction.adapter';
import { PrismaTransactionIntegration } from './Transaction/transaction.service';
import { AccountRepository } from '@/modules/Account/domain/account.repository';
import { PrismaAccountRepository } from '@/modules/Account/infra/persistence/account.repository';
import { VerifyPhoneRepository } from '@/modules/Auth/verifyPhone/domain/verify-phone-repository';
import { PrismaVerifyPhoneRepository } from '@/modules/Auth/verifyPhone/infra/persistence/verify-phone.repository';

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: [
    PrismaService,
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
    {
      provide: FileRepository,
      useClass: PrismaFileRepository,
    },
    {
      provide: RefreshTokenRepository,
      useClass: PrismaRefreshTokenRepository,
    },
    {
      provide: Token2FARepository,
      useClass: PrismaToken2FaRepository,
    },
    {
      provide: ResetPasswordTokenRepository,
      useClass: PrismaResetPasswordTokenRepository,
    },
    {
      provide: TransactionAdapter,
      useClass: PrismaTransactionIntegration,
    },
    {
      provide: AccountRepository,
      useClass: PrismaAccountRepository,
    },
    {
      provide: VerifyPhoneRepository,
      useClass: PrismaVerifyPhoneRepository,
    },
  ],
  exports: [
    AccountRepository,
    UserRepository,
    RefreshTokenRepository,
    FileRepository,
    Token2FARepository,
    ResetPasswordTokenRepository,
    VerifyPhoneRepository,
    TransactionAdapter,
    PrismaService,
  ],
})
export class DatabaseModule {}
