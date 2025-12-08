import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { BucketModule } from '@/infrastructure/Bucket/bucket.module';
import { CryptographyModule } from '@/infrastructure/Criptography/criptography.module';
import { DatabaseModule } from '@/infrastructure/Database/database.module';
import { ExceptionModule } from '@/infrastructure/Exceptions/exceptions.module';
import { AuthModule } from '@/modules/Auth/auth.module';
import { FileModule } from '@/modules/File/file.module';
import { UserModule } from '@/modules/User/user.module';
import { envSchema } from '@/global/env.schema';
import { JwtAuthGuard } from '@/global/common/guards/jwt-auth.guard';
import { QueueModule } from '@/infrastructure/Queue/queue.module';
import { CronModule } from '@/infrastructure/Cron/cron.module';
import { LoggerModule } from '@/infrastructure/Logger/logger.module';
import { LoggerInterceptor } from '@/infrastructure/Logger/services/logger.interceptor';
import { AccountModule } from '@/modules/Account/account.module';
import { CookiesModule } from '@/infrastructure/Cookies/cookies.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validate: (env) => envSchema.parse(env),
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 40,
      },
    ]),
    ExceptionModule,
    LoggerModule,
    CryptographyModule,
    CronModule,
    DatabaseModule,
    UserModule,
    AccountModule,
    AuthModule,
    QueueModule,
    FileModule,
    BucketModule,
    CookiesModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggerInterceptor,
    },
  ],
})
export class AppModule {}
