import { Module } from '@nestjs/common';
import { ConfigModule } from './config';
import { CacheModule } from './cache';
import { DatabaseModule } from './database';
import { LoggerModule } from './logger';
import { UserModule } from './user';
import { MailerModule } from './mailer';

@Module({
  imports: [DatabaseModule, ConfigModule, LoggerModule, CacheModule, UserModule, MailerModule],
  exports: [DatabaseModule, ConfigModule, LoggerModule, CacheModule, UserModule],
})
export class CoreModule {}
