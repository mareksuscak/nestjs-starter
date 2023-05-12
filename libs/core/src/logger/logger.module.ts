import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';

const currentEnvironment = process.env.NODE_ENV || 'development';

// Google Cloud Logging uses severity levels instead log levels. As a result, all logs may show
// as INFO level logs while completely ignoring the level set in the pino log. Google Cloud Logging
// also prefers that log data is present inside a message key instead of the default msg key that
// Pino uses. Use a technique similar to the one below to retain log levels in Google Clould Logging

// https://cloud.google.com/logging/docs/reference/v2/rest/v2/LogEntry#logseverity
const PinoLevelToSeverityLookup = {
  trace: 'DEBUG',
  debug: 'DEBUG',
  info: 'INFO',
  warn: 'WARNING',
  error: 'ERROR',
  fatal: 'CRITICAL',
};

const getTransport = () => {
  if (currentEnvironment !== 'production') {
    // Colorizes output and prints to process.stdout
    return {
      target: 'pino-pretty',
      options: {
        singleLine: true,
        colorize: true,
        messageKey: 'message',
        ignore: 'severity,req,res',
      },
    };
  } else {
    // Prints to process.stdout by default
    return { target: 'pino/file' };
  }
};

// See:
// https://getpino.io/#/docs/api?id=loggerlevel-string-gettersetter

const getLevel = () => {
  if (currentEnvironment === 'production') {
    return 'info';
  } else if (currentEnvironment === 'test') {
    return 'silent'; // use info or warn if you need to debug
  } else {
    return 'debug';
  }
};

@Module({
  imports: [
    PinoLoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        return {
          pinoHttp: {
            name: 'app',

            // https://getpino.io/#/docs/api?id=level-string
            level: getLevel(),

            // Use a transport and offload logging to a worker
            // https://getpino.io/#/docs/api?id=transport-object
            transport: getTransport(),

            // Redaction of sensitive keys
            // https://getpino.io/#/docs/redaction
            redact: ['req.headers.authorization'],

            // Needed for Google Cloud Logging preferred format compatibility
            // https://cloud.google.com/logging/docs/reference/v2/rest/v2/LogEntry#logseverity
            messageKey: 'message',

            // https://getpino.io/#/docs/api?id=formatters-object
            formatters: {
              level(label, number) {
                return {
                  severity: PinoLevelToSeverityLookup[label] || PinoLevelToSeverityLookup['info'],
                  level: number,
                };
              },
            },
          },
        };
      },
    }),
  ],
})
export class LoggerModule {}
