import { UniqueConstraintViolationException, ValidationError } from '@mikro-orm/core';
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  InternalServerErrorException,
  BadRequestException,
  ForbiddenException,
  Logger,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: any, host: ArgumentsHost): void {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    let error: HttpException;
    if (exception instanceof UniqueConstraintViolationException) {
      error = new BadRequestException({ statusCode: HttpStatus.BAD_REQUEST, message: 'Unique constraint violation' });
    } else if (exception instanceof ValidationError) {
      error = new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: exception.message,
        details: exception.getEntity(),
      });
    } else if (exception instanceof ForbiddenException) {
      error = new ForbiddenException({ statusCode: HttpStatus.FORBIDDEN, message: exception.message });
    } else if (!(exception instanceof HttpException)) {
      this.logger.error(exception);
      error = new InternalServerErrorException(
        process.env.NODE_ENV !== 'production' || process.env.APP_DEBUG === 'true'
          ? {
              statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
              message: (exception as Error).message,
              details: (exception as Error).stack,
            }
          : undefined,
      );
    } else {
      error = exception;
    }

    httpAdapter.reply(ctx.getResponse(), error.getResponse(), error.getStatus());
  }
}
