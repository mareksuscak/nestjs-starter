import { Logger } from '@nestjs/common';
import { LoadStrategy, LoggerNamespace } from '@mikro-orm/core';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import { defineConfig } from '@mikro-orm/postgresql';

// Instantiate the logger
const logger = new Logger('MikroORM');

// Documentation (incl. defaults)
// https://mikro-orm.io/docs/configuration/

// Defaults:
// https://github.com/mikro-orm/mikro-orm/blob/master/packages/core/src/utils/Configuration.ts#L44

const logLevel = process.env.MIKROORM_LOG_LEVEL
  ? (process.env.MIKROORM_LOG_LEVEL.split(',') as LoggerNamespace[])
  : false;

const config = defineConfig({
  driverOptions: {
    connection: {
      connectionString: process.env.DATABASE_URL,
    },
  },

  // This is a dummy value that is overriden in driver options. This is because MikroORM's connection string
  // parser doesn't fully support unix socket connection strings whereas Knex and the underlying pg package
  // supports the socket protocol out of the box:
  // Refs:
  // - https://www.npmjs.com/package/pg-connection-string
  // - https://knexjs.org/guide/#configuration-options
  // - https://mikro-orm.io/docs/configuration/#driver
  clientUrl: 'postgresql://postgres@127.0.0.1:5432/db',

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
    tableName: 'migration',
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
    max: +process.env.DATABASE_CONN_POOL_SIZE || 25,
  },
});

export default config;
