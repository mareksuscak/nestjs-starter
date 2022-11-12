import { MikroOrmModuleOptions } from '@mikro-orm/nestjs';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import { LoadStrategy, LoggerNamespace } from '@mikro-orm/core';
import { Logger } from '@nestjs/common';

// Instantiate the logger
const logger = new Logger('MikroORM');

// Documentation (incl. defaults)
// https://mikro-orm.io/docs/configuration/

// Defaults:
// https://github.com/mikro-orm/mikro-orm/blob/master/packages/core/src/utils/Configuration.ts#L44

const logLevel = process.env.MIKROORM_LOG_LEVEL
  ? (process.env.MIKROORM_LOG_LEVEL.split(',') as LoggerNamespace[])
  : false;

const config: MikroOrmModuleOptions = {
  type: 'postgresql',
  clientUrl: process.env.DATABASE_URL,
  logger: logger.debug.bind(logger),
  debug: logLevel,
  highlighter: new SqlHighlighter(),
  loadStrategy: LoadStrategy.JOINED,
  forceUtcTimezone: true,

  baseDir: process.cwd(),
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['libs/**/*.entity.ts', 'apps/**/*.entity.ts'],

  seeder: {
    path: 'dist/libs/core/src/database/seeder',
    pathTs: 'libs/core/src/database/seeder',
    defaultSeeder: 'DatabaseSeeder',
    glob: '!(*.d).{js,ts}',
  },

  migrations: {
    tableName: 'migrations',
    path: 'dist/libs/core/database/migrations',
    pathTs: 'libs/core/src/database/migrations',
    glob: '!(*.d).{js,ts}',
    snapshot: true,

    // Mikro ORM PG driver requires a super user role because it uses a trick where it changes the session role to `replica`
    // temporarily in order to disable foreign key checks when running migrations. This is problematic and insecure.
    // The official recommendation is to disable this behavior.
    disableForeignKeys: false,
  },

  pool: {
    min: 1,
    max: +process.env.DATABASE_CONN_POOL_SIZE || 10,
  },
};

export default config;
