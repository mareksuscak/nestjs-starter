import { Module } from '@nestjs/common';
import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    NestCacheModule.register({
      ttl: 1000 * 5, // defaults to 5 seconds
    }),
  ],
})
export class CacheModule {}
