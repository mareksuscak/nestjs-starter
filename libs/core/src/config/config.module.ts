import { ConfigModule as NestConfigModule } from '@nestjs/config';

const currentEnvironment = process.env.NODE_ENV || 'development';

export const ConfigModule = NestConfigModule.forRoot({
  isGlobal: true,

  // If a variable is found in multiple files, the former one takes precedence.
  envFilePath: [`.env.${currentEnvironment}.local`, `.env.${currentEnvironment}`, '.env.local', '.env'],
});
