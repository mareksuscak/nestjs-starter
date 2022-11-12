import {
  ClassSerializerInterceptor,
  LogLevel,
  RequestMethod,
  UnprocessableEntityException,
  ValidationPipe,
  VersioningType,
  VERSION_NEUTRAL,
} from '@nestjs/common';
import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './shared/all-exceptions.interceptor';
import helmet from 'helmet';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const logLevel = process.env.NEST_LOG_LEVEL || 'log,error,warn,debug';

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: logLevel.split(',') as LogLevel[],
    bufferLogs: true,
  });

  // Trust upstream proxies
  // https://expressjs.com/en/guide/behind-proxies.html
  const trustProxy = process.env.TRUSTED_PROXIES === 'true' ? true : process.env.TRUSTED_PROXIES;
  app.set('trust proxy', trustProxy || 'loopback');

  // Set global prefix
  // https://docs.nestjs.com/faq/global-prefix#global-prefix
  app.setGlobalPrefix('api', {
    exclude: [{ path: 'healthz', method: RequestMethod.GET }],
  });

  // Find the config service in the container
  // https://docs.nestjs.com/techniques/configuration#using-in-the-maints
  const configService = app.get<ConfigService>(ConfigService);

  // Use the custom logger (Pino)
  // https://docs.nestjs.com/techniques/logger#dependency-injection
  const logger = app.get(Logger);
  app.useLogger(logger);

  // Use the global validation pipe
  // https://docs.nestjs.com/techniques/validation#using-the-built-in-validationpipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidUnknownValues: true,

      exceptionFactory(validationErrors = []) {
        return new UnprocessableEntityException(
          validationErrors.flatMap((validationError) => {
            return Object.values(validationError.constraints).map((constraint) => ({
              field: validationError.property,
              message: constraint,
            }));
          }),
        );
      },
    }),
  );

  // Use the global exception filter
  // https://docs.nestjs.com/exception-filters#catch-everything
  const adapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(adapterHost));

  // Use helmet (applies security best practices)
  // https://docs.nestjs.com/security/helmet#helmet
  app.use(helmet());

  // Log error details
  // https://github.com/iamolegga/nestjs-pino#expose-stack-trace-and-error-class-in-err-property
  app.useGlobalInterceptors(
    new LoggerErrorInterceptor(),
    new ClassSerializerInterceptor(app.get(Reflector), { enableCircularCheck: false }),
  );

  // Enable API versioning
  // https://docs.nestjs.com/techniques/versioning
  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'v',
    defaultVersion: VERSION_NEUTRAL,
  });

  // Ensure CORS is on
  // https://docs.nestjs.com/security/cors
  const allowedOrigins = configService.get<string>('CORS_ALLOW_ORIGIN', '^https?://(localhost|127.0.0.1)(:[0-9]+)?$');

  app.enableCors({
    origin: new RegExp(allowedOrigins),
  });

  // Starts listening for shutdown hooks
  app.enableShutdownHooks();

  // Setup Swagger
  // https://docs.nestjs.com/openapi/introduction
  const version = configService.get<string>('APP_VERSION', '1.0');
  const config = new DocumentBuilder()
    .setTitle('API')
    .setDescription('The API documentation')
    .setVersion(version)
    .addTag('api')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  // Launch the application. We intentionally do not pass in the host and let the framework pick the IP version.
  const port = configService.get<string>('PORT', '3000');
  const portNumber = parseInt(port, 10);
  await app.listen(portNumber);
}
bootstrap();
