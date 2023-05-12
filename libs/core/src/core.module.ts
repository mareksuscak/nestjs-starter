import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { CacheModule } from './cache/cache.module';
import { DatabaseModule } from './database/database.module';
import { LoggerModule } from './logger/logger.module';
import { UserModule } from './user/user.module';
import { MailerModule } from './mailer/mailer.module';

@Module({
  imports: [DatabaseModule, ConfigModule, LoggerModule, CacheModule, UserModule, MailerModule],
  exports: [DatabaseModule, ConfigModule, LoggerModule, CacheModule, UserModule],
})
export class CoreModule {}
