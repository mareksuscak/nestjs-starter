import { LogLevel } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Logger } from 'nestjs-pino';
import { WorkerModule } from './worker.module';

async function bootstrap() {
  const logLevel = process.env.NEST_LOG_LEVEL || 'log,error,warn,debug';

  const app = await NestFactory.createApplicationContext(WorkerModule, {
    logger: logLevel.split(',') as LogLevel[],
    bufferLogs: true,
  });

  // Use the custom logger (Pino)
  // https://docs.nestjs.com/techniques/logger#dependency-injection
  const logger = app.get(Logger);
  app.useLogger(logger);

  // Starts listening for shutdown hooks
  app.enableShutdownHooks();
}
bootstrap();
