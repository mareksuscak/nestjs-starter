import { LogLevel } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { Logger } from 'nestjs-pino';
import { RedisIoAdapter } from './adapters/redis-io.adapter';
import { HubModule } from './hub.module';

async function bootstrap() {
  const logLevel = process.env.NEST_LOG_LEVEL || 'log,error,warn,debug';

  const trustProxy = process.env.TRUSTED_PROXIES === 'true' ? true : process.env.TRUSTED_PROXIES;
  const app = await NestFactory.create<NestFastifyApplication>(
    HubModule,
    new FastifyAdapter({ trustProxy: trustProxy || 'loopback' }),
    {
      logger: logLevel.split(',') as LogLevel[],
      bufferLogs: true,
    },
  );

  // Uncomment these lines to use the Redis adapter:
  const redisIoAdapter = new RedisIoAdapter(app);
  await redisIoAdapter.connectToRedis();
  app.useWebSocketAdapter(redisIoAdapter);

  // Find the config service in the container
  // https://docs.nestjs.com/techniques/configuration#using-in-the-maints
  const configService = app.get<ConfigService>(ConfigService);

  // Use the custom logger (Pino)
  // https://docs.nestjs.com/techniques/logger#dependency-injection
  const logger = app.get(Logger);
  app.useLogger(logger);

  // Starts listening for shutdown hooks
  app.enableShutdownHooks();

  // Launch the application. We intentionally do not pass in the host and let the framework pick the IP version.
  const port = configService.get<string>('PORT', '3000');
  const portNumber = parseInt(port, 10);
  await app.listen(portNumber, '::');
}
bootstrap();
