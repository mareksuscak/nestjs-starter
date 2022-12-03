import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { CacheModule } from './cache/cache.module';
import { DatabaseModule } from './database/database.module';
import { LoggerModule } from './logger/logger.module';

@Module({
  imports: [DatabaseModule, ConfigModule, LoggerModule, CacheModule],
  exports: [DatabaseModule, ConfigModule, LoggerModule, CacheModule],
})
export class CoreModule {}
