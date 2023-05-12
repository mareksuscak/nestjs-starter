import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';

export const CacheModule = NestCacheModule.register({
  ttl: 1000 * 5, // defaults to 5 seconds
});
